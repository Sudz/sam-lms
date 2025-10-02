import { createMiddleware, createEndpoint, APIError } from 'better-call';
import { g as getDate } from './better-auth.CW6D9eSx.mjs';
import { d as deleteSessionCookie, s as setSessionCookie, b as setCookieCache } from './better-auth.L4mY8Wf-.mjs';
import * as z from 'zod';
import { s as safeJSONParse } from './better-auth.BTrSrKsi.mjs';
import { d as defineErrorCodes } from './better-auth.D2xndZ2p.mjs';
import { createHMAC } from '@better-auth/utils/hmac';
import { base64Url } from '@better-auth/utils/base64';
import { binary } from '@better-auth/utils/binary';

const optionsMiddleware = createMiddleware(async () => {
  return {};
});
const createAuthMiddleware = createMiddleware.create({
  use: [
    optionsMiddleware,
    /**
     * Only use for post hooks
     */
    createMiddleware(async () => {
      return {};
    })
  ]
});
const createAuthEndpoint = createEndpoint.create({
  use: [optionsMiddleware]
});

const BASE_ERROR_CODES = defineErrorCodes({
  USER_NOT_FOUND: "User not found",
  FAILED_TO_CREATE_USER: "Failed to create user",
  FAILED_TO_CREATE_SESSION: "Failed to create session",
  FAILED_TO_UPDATE_USER: "Failed to update user",
  FAILED_TO_GET_SESSION: "Failed to get session",
  INVALID_PASSWORD: "Invalid password",
  INVALID_EMAIL: "Invalid email",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked",
  PROVIDER_NOT_FOUND: "Provider not found",
  INVALID_TOKEN: "Invalid token",
  ID_TOKEN_NOT_SUPPORTED: "id_token not supported",
  FAILED_TO_GET_USER_INFO: "Failed to get user info",
  USER_EMAIL_NOT_FOUND: "User email not found",
  EMAIL_NOT_VERIFIED: "Email not verified",
  PASSWORD_TOO_SHORT: "Password too short",
  PASSWORD_TOO_LONG: "Password too long",
  USER_ALREADY_EXISTS: "User already exists.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "User already exists. Use another email.",
  EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found",
  SESSION_EXPIRED: "Session expired. Re-authenticate to perform this action.",
  FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
  ACCOUNT_NOT_FOUND: "Account not found",
  USER_ALREADY_HAS_PASSWORD: "User already has a password. Provide that to delete the account."
});

const getSessionQuerySchema = z.optional(
  z.object({
    /**
     * If cookie cache is enabled, it will disable the cache
     * and fetch the session from the database
     */
    disableCookieCache: z.coerce.boolean().meta({
      description: "Disable cookie cache and fetch session from database"
    }).optional(),
    disableRefresh: z.coerce.boolean().meta({
      description: "Disable session refresh. Useful for checking session status, without updating the session"
    }).optional()
  })
);
const getSession = () => createAuthEndpoint(
  "/get-session",
  {
    method: "GET",
    query: getSessionQuerySchema,
    requireHeaders: true,
    metadata: {
      openapi: {
        description: "Get the current session",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    session: {
                      $ref: "#/components/schemas/Session"
                    },
                    user: {
                      $ref: "#/components/schemas/User"
                    }
                  },
                  required: ["session", "user"]
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    try {
      const sessionCookieToken = await ctx.getSignedCookie(
        ctx.context.authCookies.sessionToken.name,
        ctx.context.secret
      );
      if (!sessionCookieToken) {
        return null;
      }
      const sessionDataCookie = ctx.getCookie(
        ctx.context.authCookies.sessionData.name
      );
      const sessionDataPayload = sessionDataCookie ? safeJSONParse(binary.decode(base64Url.decode(sessionDataCookie))) : null;
      if (sessionDataPayload) {
        const isValid = await createHMAC("SHA-256", "base64urlnopad").verify(
          ctx.context.secret,
          JSON.stringify({
            ...sessionDataPayload.session,
            expiresAt: sessionDataPayload.expiresAt
          }),
          sessionDataPayload.signature
        );
        if (!isValid) {
          const dataCookie = ctx.context.authCookies.sessionData.name;
          ctx.setCookie(dataCookie, "", {
            maxAge: 0
          });
          return ctx.json(null);
        }
      }
      const dontRememberMe = await ctx.getSignedCookie(
        ctx.context.authCookies.dontRememberToken.name,
        ctx.context.secret
      );
      if (sessionDataPayload?.session && ctx.context.options.session?.cookieCache?.enabled && !ctx.query?.disableCookieCache) {
        const session2 = sessionDataPayload.session;
        const hasExpired = sessionDataPayload.expiresAt < Date.now() || session2.session.expiresAt < /* @__PURE__ */ new Date();
        if (!hasExpired) {
          ctx.context.session = session2;
          return ctx.json(
            session2
          );
        } else {
          const dataCookie = ctx.context.authCookies.sessionData.name;
          ctx.setCookie(dataCookie, "", {
            maxAge: 0
          });
        }
      }
      const session = await ctx.context.internalAdapter.findSession(sessionCookieToken);
      ctx.context.session = session;
      if (!session || session.session.expiresAt < /* @__PURE__ */ new Date()) {
        deleteSessionCookie(ctx);
        if (session) {
          await ctx.context.internalAdapter.deleteSession(
            session.session.token
          );
        }
        return ctx.json(null);
      }
      if (dontRememberMe || ctx.query?.disableRefresh) {
        return ctx.json(
          session
        );
      }
      const expiresIn = ctx.context.sessionConfig.expiresIn;
      const updateAge = ctx.context.sessionConfig.updateAge;
      const sessionIsDueToBeUpdatedDate = session.session.expiresAt.valueOf() - expiresIn * 1e3 + updateAge * 1e3;
      const shouldBeUpdated = sessionIsDueToBeUpdatedDate <= Date.now();
      if (shouldBeUpdated && (!ctx.query?.disableRefresh || !ctx.context.options.session?.disableSessionRefresh)) {
        const updatedSession = await ctx.context.internalAdapter.updateSession(
          session.session.token,
          {
            expiresAt: getDate(ctx.context.sessionConfig.expiresIn, "sec"),
            updatedAt: /* @__PURE__ */ new Date()
          }
        );
        if (!updatedSession) {
          deleteSessionCookie(ctx);
          return ctx.json(null, { status: 401 });
        }
        const maxAge = (updatedSession.expiresAt.valueOf() - Date.now()) / 1e3;
        await setSessionCookie(
          ctx,
          {
            session: updatedSession,
            user: session.user
          },
          false,
          {
            maxAge
          }
        );
        return ctx.json({
          session: updatedSession,
          user: session.user
        });
      }
      await setCookieCache(ctx, session, !!dontRememberMe);
      return ctx.json(
        session
      );
    } catch (error) {
      ctx.context.logger.error("INTERNAL_SERVER_ERROR", error);
      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: BASE_ERROR_CODES.FAILED_TO_GET_SESSION
      });
    }
  }
);
const getSessionFromCtx = async (ctx, config) => {
  if (ctx.context.session) {
    return ctx.context.session;
  }
  const session = await getSession()({
    ...ctx,
    asResponse: false,
    headers: ctx.headers,
    returnHeaders: false,
    query: {
      ...config,
      ...ctx.query
    }
  }).catch((e) => {
    return null;
  });
  ctx.context.session = session;
  return session;
};
const sessionMiddleware = createAuthMiddleware(async (ctx) => {
  const session = await getSessionFromCtx(ctx);
  if (!session?.session) {
    throw new APIError("UNAUTHORIZED");
  }
  return {
    session
  };
});
const sensitiveSessionMiddleware = createAuthMiddleware(async (ctx) => {
  const session = await getSessionFromCtx(ctx, { disableCookieCache: true });
  if (!session?.session) {
    throw new APIError("UNAUTHORIZED");
  }
  return {
    session
  };
});
const requestOnlySessionMiddleware = createAuthMiddleware(
  async (ctx) => {
    const session = await getSessionFromCtx(ctx);
    if (!session?.session && (ctx.request || ctx.headers)) {
      throw new APIError("UNAUTHORIZED");
    }
    return { session };
  }
);
const freshSessionMiddleware = createAuthMiddleware(async (ctx) => {
  const session = await getSessionFromCtx(ctx);
  if (!session?.session) {
    throw new APIError("UNAUTHORIZED");
  }
  if (ctx.context.sessionConfig.freshAge === 0) {
    return {
      session
    };
  }
  const freshAge = ctx.context.sessionConfig.freshAge;
  const lastUpdated = session.session.updatedAt?.valueOf() || session.session.createdAt.valueOf();
  const now = Date.now();
  const isFresh = now - lastUpdated < freshAge * 1e3;
  if (!isFresh) {
    throw new APIError("FORBIDDEN", {
      message: "Session is not fresh"
    });
  }
  return {
    session
  };
});
const listSessions = () => createAuthEndpoint(
  "/list-sessions",
  {
    method: "GET",
    use: [sessionMiddleware],
    requireHeaders: true,
    metadata: {
      openapi: {
        description: "List all active sessions for the user",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Session"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    try {
      const sessions = await ctx.context.internalAdapter.listSessions(
        ctx.context.session.user.id
      );
      const activeSessions = sessions.filter((session) => {
        return session.expiresAt > /* @__PURE__ */ new Date();
      });
      return ctx.json(
        activeSessions
      );
    } catch (e) {
      ctx.context.logger.error(e);
      throw ctx.error("INTERNAL_SERVER_ERROR");
    }
  }
);
const revokeSession = createAuthEndpoint(
  "/revoke-session",
  {
    method: "POST",
    body: z.object({
      token: z.string().meta({
        description: "The token to revoke"
      })
    }),
    use: [sensitiveSessionMiddleware],
    requireHeaders: true,
    metadata: {
      openapi: {
        description: "Revoke a single session",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    description: "The token to revoke"
                  }
                },
                required: ["token"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "boolean",
                      description: "Indicates if the session was revoked successfully"
                    }
                  },
                  required: ["status"]
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const token = ctx.body.token;
    const findSession = await ctx.context.internalAdapter.findSession(token);
    if (!findSession) {
      throw new APIError("BAD_REQUEST", {
        message: "Session not found"
      });
    }
    if (findSession.session.userId !== ctx.context.session.user.id) {
      throw new APIError("UNAUTHORIZED");
    }
    try {
      await ctx.context.internalAdapter.deleteSession(token);
    } catch (error) {
      ctx.context.logger.error(
        error && typeof error === "object" && "name" in error ? error.name : "",
        error
      );
      throw new APIError("INTERNAL_SERVER_ERROR");
    }
    return ctx.json({
      status: true
    });
  }
);
const revokeSessions = createAuthEndpoint(
  "/revoke-sessions",
  {
    method: "POST",
    use: [sensitiveSessionMiddleware],
    requireHeaders: true,
    metadata: {
      openapi: {
        description: "Revoke all sessions for the user",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "boolean",
                      description: "Indicates if all sessions were revoked successfully"
                    }
                  },
                  required: ["status"]
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    try {
      await ctx.context.internalAdapter.deleteSessions(
        ctx.context.session.user.id
      );
    } catch (error) {
      ctx.context.logger.error(
        error && typeof error === "object" && "name" in error ? error.name : "",
        error
      );
      throw new APIError("INTERNAL_SERVER_ERROR");
    }
    return ctx.json({
      status: true
    });
  }
);
const revokeOtherSessions = createAuthEndpoint(
  "/revoke-other-sessions",
  {
    method: "POST",
    requireHeaders: true,
    use: [sensitiveSessionMiddleware],
    metadata: {
      openapi: {
        description: "Revoke all other sessions for the user except the current one",
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "boolean",
                      description: "Indicates if all other sessions were revoked successfully"
                    }
                  },
                  required: ["status"]
                }
              }
            }
          }
        }
      }
    }
  },
  async (ctx) => {
    const session = ctx.context.session;
    if (!session.user) {
      throw new APIError("UNAUTHORIZED");
    }
    const sessions = await ctx.context.internalAdapter.listSessions(
      session.user.id
    );
    const activeSessions = sessions.filter((session2) => {
      return session2.expiresAt > /* @__PURE__ */ new Date();
    });
    const otherSessions = activeSessions.filter(
      (session2) => session2.token !== ctx.context.session.session.token
    );
    await Promise.all(
      otherSessions.map(
        (session2) => ctx.context.internalAdapter.deleteSession(session2.token)
      )
    );
    return ctx.json({
      status: true
    });
  }
);

export { BASE_ERROR_CODES as B, createAuthEndpoint as a, getSession as b, createAuthMiddleware as c, revokeSessions as d, revokeSession as e, freshSessionMiddleware as f, getSessionFromCtx as g, getSessionQuerySchema as h, sensitiveSessionMiddleware as i, requestOnlySessionMiddleware as j, listSessions as l, optionsMiddleware as o, revokeOtherSessions as r, sessionMiddleware as s };
