'use strict';

const betterCall = require('better-call');
require('../../shared/better-auth.l_Ru3SGW.cjs');
const session = require('../../shared/better-auth.B0k5C6Ik.cjs');
require('zod');
const cookies_index = require('../../shared/better-auth.anw-08Z3.cjs');
require('../../shared/better-auth.B6fIklBU.cjs');
require('@better-auth/core/db');
const schema$1 = require('../../shared/better-auth.Bu93hUoT.cjs');
require('../../shared/better-auth.BToNb2fI.cjs');
const id = require('../../shared/better-auth.Bg6iw3ig.cjs');
require('@better-auth/utils/hash');
require('@noble/ciphers/chacha.js');
require('@noble/ciphers/utils.js');
require('@better-auth/utils/base64');
require('jose');
require('@noble/hashes/scrypt.js');
require('@better-auth/utils/hex');
require('@noble/hashes/utils.js');
require('../../shared/better-auth.CYeOI8C-.cjs');
require('kysely');
const url = require('../../shared/better-auth.DxBcELEX.cjs');
require('../../shared/better-auth.C1hdVENX.cjs');
require('../../crypto/index.cjs');
require('../../shared/better-auth.ANpbi45u.cjs');
require('@better-fetch/fetch');
require('jose/errors');
require('@better-auth/utils/random');
require('../../shared/better-auth.Jlhc86WK.cjs');
require('@better-auth/utils/hmac');
require('@better-auth/utils/binary');
require('defu');
require('../../shared/better-auth.uykCWCYS.cjs');

const schema = {
  user: {
    fields: {
      isAnonymous: {
        type: "boolean",
        required: false
      }
    }
  }
};
const anonymous = (options) => {
  const ERROR_CODES = {
    FAILED_TO_CREATE_USER: "Failed to create user",
    COULD_NOT_CREATE_SESSION: "Could not create session",
    ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY: "Anonymous users cannot sign in again anonymously"
  };
  return {
    id: "anonymous",
    endpoints: {
      signInAnonymous: session.createAuthEndpoint(
        "/sign-in/anonymous",
        {
          method: "POST",
          metadata: {
            openapi: {
              description: "Sign in anonymously",
              responses: {
                200: {
                  description: "Sign in anonymously",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          user: {
                            $ref: "#/components/schemas/User"
                          },
                          session: {
                            $ref: "#/components/schemas/Session"
                          }
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
          const existingSession = await session.getSessionFromCtx(ctx, { disableRefresh: true });
          if (existingSession?.user.isAnonymous) {
            throw new betterCall.APIError("BAD_REQUEST", {
              message: ERROR_CODES.ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY
            });
          }
          const { emailDomainName = url.getOrigin(ctx.context.baseURL) } = options || {};
          const id$1 = id.generateId();
          const email = `temp-${id$1}@${emailDomainName}`;
          const name = await options?.generateName?.(ctx) || "Anonymous";
          const newUser = await ctx.context.internalAdapter.createUser(
            {
              email,
              emailVerified: false,
              isAnonymous: true,
              name,
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            },
            ctx
          );
          if (!newUser) {
            throw ctx.error("INTERNAL_SERVER_ERROR", {
              message: ERROR_CODES.FAILED_TO_CREATE_USER
            });
          }
          const session$1 = await ctx.context.internalAdapter.createSession(
            newUser.id,
            ctx
          );
          if (!session$1) {
            return ctx.json(null, {
              status: 400,
              body: {
                message: ERROR_CODES.COULD_NOT_CREATE_SESSION
              }
            });
          }
          await cookies_index.setSessionCookie(ctx, {
            session: session$1,
            user: newUser
          });
          return ctx.json({
            token: session$1.token,
            user: {
              id: newUser.id,
              email: newUser.email,
              emailVerified: newUser.emailVerified,
              name: newUser.name,
              createdAt: newUser.createdAt,
              updatedAt: newUser.updatedAt
            }
          });
        }
      )
    },
    hooks: {
      after: [
        {
          matcher(ctx) {
            return ctx.path.startsWith("/sign-in") || ctx.path.startsWith("/sign-up") || ctx.path.startsWith("/callback") || ctx.path.startsWith("/oauth2/callback") || ctx.path.startsWith("/magic-link/verify") || ctx.path.startsWith("/email-otp/verify-email") || ctx.path.startsWith("/one-tap/callback") || ctx.path.startsWith("/passkey/verify-authentication");
          },
          handler: session.createAuthMiddleware(async (ctx) => {
            const setCookie = ctx.context.responseHeaders?.get("set-cookie");
            const sessionTokenName = ctx.context.authCookies.sessionToken.name;
            const sessionCookie = cookies_index.parseSetCookieHeader(setCookie || "").get(sessionTokenName)?.value.split(".")[0];
            if (!sessionCookie) {
              return;
            }
            const session$1 = await session.getSessionFromCtx(
              ctx,
              {
                disableRefresh: true
              }
            );
            if (!session$1 || !session$1.user.isAnonymous) {
              return;
            }
            if (ctx.path === "/sign-in/anonymous" && !ctx.context.newSession) {
              throw new betterCall.APIError("BAD_REQUEST", {
                message: ERROR_CODES.ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY
              });
            }
            const newSession = ctx.context.newSession;
            if (!newSession) {
              return;
            }
            if (options?.onLinkAccount) {
              await options?.onLinkAccount?.({
                anonymousUser: session$1,
                newUser: newSession
              });
            }
            if (!options?.disableDeleteAnonymousUser) {
              await ctx.context.internalAdapter.deleteUser(session$1.user.id);
            }
          })
        }
      ]
    },
    schema: schema$1.mergeSchema(schema, options?.schema),
    $ERROR_CODES: ERROR_CODES
  };
};

exports.anonymous = anonymous;
