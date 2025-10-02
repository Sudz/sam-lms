'use strict';

const betterCall = require('better-call');
const socialProviders_index = require('../shared/better-auth.l_Ru3SGW.cjs');
const session = require('../shared/better-auth.B0k5C6Ik.cjs');
const z = require('zod');
const cookies_index = require('../shared/better-auth.anw-08Z3.cjs');
const env = require('../shared/better-auth.B6fIklBU.cjs');
require('@better-auth/core/db');
const schema = require('../shared/better-auth.Bu93hUoT.cjs');
const logger = require('../shared/better-auth.BToNb2fI.cjs');
require('@better-auth/utils/random');
require('@better-auth/utils/hash');
require('@noble/ciphers/chacha.js');
require('@noble/ciphers/utils.js');
require('@better-auth/utils/base64');
require('jose');
require('@noble/hashes/scrypt.js');
require('@better-auth/utils/hex');
require('@noble/hashes/utils.js');
require('../shared/better-auth.CYeOI8C-.cjs');
require('kysely');
const json = require('../shared/better-auth.Jlhc86WK.cjs');
const getRequestIp = require('../shared/better-auth.D1rR7ww4.cjs');
require('../shared/better-auth.C1hdVENX.cjs');
require('../crypto/index.cjs');
require('../shared/better-auth.ANpbi45u.cjs');
require('@better-fetch/fetch');
require('../shared/better-auth.DxBcELEX.cjs');
require('jose/errors');
require('../shared/better-auth.Bg6iw3ig.cjs');
require('@better-auth/utils/hmac');
require('@better-auth/utils/binary');
require('defu');
require('../shared/better-auth.uykCWCYS.cjs');

function _interopNamespaceCompat(e) {
	if (e && typeof e === 'object' && 'default' in e) return e;
	const n = Object.create(null);
	if (e) {
		for (const k in e) {
			n[k] = e[k];
		}
	}
	n.default = e;
	return n;
}

const z__namespace = /*#__PURE__*/_interopNamespaceCompat(z);

const signUpEmail = () => session.createAuthEndpoint(
  "/sign-up/email",
  {
    method: "POST",
    body: z__namespace.record(z__namespace.string(), z__namespace.any()),
    metadata: {
      $Infer: {
        body: {}
      },
      openapi: {
        description: "Sign up a user using email and password",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "The name of the user"
                  },
                  email: {
                    type: "string",
                    description: "The email of the user"
                  },
                  password: {
                    type: "string",
                    description: "The password of the user"
                  },
                  image: {
                    type: "string",
                    description: "The profile image URL of the user"
                  },
                  callbackURL: {
                    type: "string",
                    description: "The URL to use for email verification callback"
                  },
                  rememberMe: {
                    type: "boolean",
                    description: "If this is false, the session will not be remembered. Default is `true`."
                  }
                },
                required: ["name", "email", "password"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Successfully created user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      nullable: true,
                      description: "Authentication token for the session"
                    },
                    user: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          description: "The unique identifier of the user"
                        },
                        email: {
                          type: "string",
                          format: "email",
                          description: "The email address of the user"
                        },
                        name: {
                          type: "string",
                          description: "The name of the user"
                        },
                        image: {
                          type: "string",
                          format: "uri",
                          nullable: true,
                          description: "The profile image URL of the user"
                        },
                        emailVerified: {
                          type: "boolean",
                          description: "Whether the email has been verified"
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          description: "When the user was created"
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                          description: "When the user was last updated"
                        }
                      },
                      required: [
                        "id",
                        "email",
                        "name",
                        "emailVerified",
                        "createdAt",
                        "updatedAt"
                      ]
                    }
                  },
                  required: ["user"]
                  // token is optional
                }
              }
            }
          },
          "422": {
            description: "Unprocessable Entity. User already exists or failed to create user.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string"
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
    if (!ctx.context.options.emailAndPassword?.enabled || ctx.context.options.emailAndPassword?.disableSignUp) {
      throw new betterCall.APIError("BAD_REQUEST", {
        message: "Email and password sign up is not enabled"
      });
    }
    const body = ctx.body;
    const { name, email, password, image, callbackURL, rememberMe, ...rest } = body;
    const isValidEmail = z__namespace.email().safeParse(email);
    if (!isValidEmail.success) {
      throw new betterCall.APIError("BAD_REQUEST", {
        message: session.BASE_ERROR_CODES.INVALID_EMAIL
      });
    }
    const minPasswordLength = ctx.context.password.config.minPasswordLength;
    if (password.length < minPasswordLength) {
      ctx.context.logger.error("Password is too short");
      throw new betterCall.APIError("BAD_REQUEST", {
        message: session.BASE_ERROR_CODES.PASSWORD_TOO_SHORT
      });
    }
    const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
    if (password.length > maxPasswordLength) {
      ctx.context.logger.error("Password is too long");
      throw new betterCall.APIError("BAD_REQUEST", {
        message: session.BASE_ERROR_CODES.PASSWORD_TOO_LONG
      });
    }
    const dbUser = await ctx.context.internalAdapter.findUserByEmail(email);
    if (dbUser?.user) {
      ctx.context.logger.info(`Sign-up attempt for existing email: ${email}`);
      throw new betterCall.APIError("UNPROCESSABLE_ENTITY", {
        message: session.BASE_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL
      });
    }
    const hash = await ctx.context.password.hash(password);
    let createdUser;
    try {
      const data = schema.parseUserInput(ctx.context.options, rest, "create");
      createdUser = await ctx.context.internalAdapter.createUser(
        {
          email: email.toLowerCase(),
          name,
          image,
          ...data,
          emailVerified: false
        },
        ctx
      );
      if (!createdUser) {
        throw new betterCall.APIError("BAD_REQUEST", {
          message: session.BASE_ERROR_CODES.FAILED_TO_CREATE_USER
        });
      }
    } catch (e) {
      if (env.isDevelopment) {
        ctx.context.logger.error("Failed to create user", e);
      }
      if (e instanceof betterCall.APIError) {
        throw e;
      }
      ctx.context.logger?.error("Failed to create user", e);
      throw new betterCall.APIError("UNPROCESSABLE_ENTITY", {
        message: session.BASE_ERROR_CODES.FAILED_TO_CREATE_USER,
        details: e
      });
    }
    if (!createdUser) {
      throw new betterCall.APIError("UNPROCESSABLE_ENTITY", {
        message: session.BASE_ERROR_CODES.FAILED_TO_CREATE_USER
      });
    }
    await ctx.context.internalAdapter.linkAccount(
      {
        userId: createdUser.id,
        providerId: "credential",
        accountId: createdUser.id,
        password: hash
      },
      ctx
    );
    if (ctx.context.options.emailVerification?.sendOnSignUp || ctx.context.options.emailAndPassword.requireEmailVerification) {
      const token = await socialProviders_index.createEmailVerificationToken(
        ctx.context.secret,
        createdUser.email,
        void 0,
        ctx.context.options.emailVerification?.expiresIn
      );
      const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${body.callbackURL || "/"}`;
      const args = ctx.request ? [
        {
          user: createdUser,
          url,
          token
        },
        ctx.request
      ] : [
        {
          user: createdUser,
          url,
          token
        }
      ];
      await ctx.context.options.emailVerification?.sendVerificationEmail?.(
        ...args
      );
    }
    if (ctx.context.options.emailAndPassword.autoSignIn === false || ctx.context.options.emailAndPassword.requireEmailVerification) {
      return ctx.json({
        token: null,
        user: {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
          image: createdUser.image,
          emailVerified: createdUser.emailVerified,
          createdAt: createdUser.createdAt,
          updatedAt: createdUser.updatedAt
        }
      });
    }
    const session$1 = await ctx.context.internalAdapter.createSession(
      createdUser.id,
      ctx,
      rememberMe === false
    );
    if (!session$1) {
      throw new betterCall.APIError("BAD_REQUEST", {
        message: session.BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION
      });
    }
    await cookies_index.setSessionCookie(
      ctx,
      {
        session: session$1,
        user: createdUser
      },
      rememberMe === false
    );
    return ctx.json({
      token: session$1.token,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        image: createdUser.image,
        emailVerified: createdUser.emailVerified,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt
      }
    });
  }
);

function shouldRateLimit(max, window, rateLimitData) {
  const now = Date.now();
  const windowInMs = window * 1e3;
  const timeSinceLastRequest = now - rateLimitData.lastRequest;
  return timeSinceLastRequest < windowInMs && rateLimitData.count >= max;
}
function rateLimitResponse(retryAfter) {
  return new Response(
    JSON.stringify({
      message: "Too many requests. Please try again later."
    }),
    {
      status: 429,
      statusText: "Too Many Requests",
      headers: {
        "X-Retry-After": retryAfter.toString()
      }
    }
  );
}
function getRetryAfter(lastRequest, window) {
  const now = Date.now();
  const windowInMs = window * 1e3;
  return Math.ceil((lastRequest + windowInMs - now) / 1e3);
}
function createDBStorage(ctx) {
  const model = "rateLimit";
  const db = ctx.adapter;
  return {
    get: async (key) => {
      const res = await db.findMany({
        model,
        where: [{ field: "key", value: key }]
      });
      const data = res[0];
      if (typeof data?.lastRequest === "bigint") {
        data.lastRequest = Number(data.lastRequest);
      }
      return data;
    },
    set: async (key, value, _update) => {
      try {
        if (_update) {
          await db.updateMany({
            model,
            where: [{ field: "key", value: key }],
            update: {
              count: value.count,
              lastRequest: value.lastRequest
            }
          });
        } else {
          await db.create({
            model,
            data: {
              key,
              count: value.count,
              lastRequest: value.lastRequest
            }
          });
        }
      } catch (e) {
        ctx.logger.error("Error setting rate limit", e);
      }
    }
  };
}
const memory = /* @__PURE__ */ new Map();
function getRateLimitStorage(ctx, rateLimitSettings) {
  if (ctx.options.rateLimit?.customStorage) {
    return ctx.options.rateLimit.customStorage;
  }
  const storage = ctx.rateLimit.storage;
  if (storage === "secondary-storage") {
    return {
      get: async (key) => {
        const data = await ctx.options.secondaryStorage?.get(key);
        return data ? json.safeJSONParse(data) : void 0;
      },
      set: async (key, value, _update) => {
        const ttl = rateLimitSettings?.window ?? ctx.options.rateLimit?.window ?? 10;
        await ctx.options.secondaryStorage?.set?.(
          key,
          JSON.stringify(value),
          ttl
        );
      }
    };
  } else if (storage === "memory") {
    return {
      async get(key) {
        return memory.get(key);
      },
      async set(key, value, _update) {
        memory.set(key, value);
      }
    };
  }
  return createDBStorage(ctx);
}
async function onRequestRateLimit(req, ctx) {
  if (!ctx.rateLimit.enabled) {
    return;
  }
  const path = new URL(req.url).pathname.replace(
    ctx.options.basePath || "/api/auth",
    ""
  );
  let window = ctx.rateLimit.window;
  let max = ctx.rateLimit.max;
  const ip = getRequestIp.getIp(req, ctx.options);
  if (!ip) {
    return;
  }
  const key = ip + path;
  const specialRules = getDefaultSpecialRules();
  const specialRule = specialRules.find((rule) => rule.pathMatcher(path));
  if (specialRule) {
    window = specialRule.window;
    max = specialRule.max;
  }
  for (const plugin of ctx.options.plugins || []) {
    if (plugin.rateLimit) {
      const matchedRule = plugin.rateLimit.find(
        (rule) => rule.pathMatcher(path)
      );
      if (matchedRule) {
        window = matchedRule.window;
        max = matchedRule.max;
        break;
      }
    }
  }
  if (ctx.rateLimit.customRules) {
    const _path = Object.keys(ctx.rateLimit.customRules).find((p) => {
      if (p.includes("*")) {
        const isMatch = socialProviders_index.wildcardMatch(p)(path);
        return isMatch;
      }
      return p === path;
    });
    if (_path) {
      const customRule = ctx.rateLimit.customRules[_path];
      const resolved = typeof customRule === "function" ? await customRule(req) : customRule;
      if (resolved) {
        window = resolved.window;
        max = resolved.max;
      }
      if (resolved === false) {
        return;
      }
    }
  }
  const storage = getRateLimitStorage(ctx, {
    window
  });
  const data = await storage.get(key);
  const now = Date.now();
  if (!data) {
    await storage.set(key, {
      key,
      count: 1,
      lastRequest: now
    });
  } else {
    const timeSinceLastRequest = now - data.lastRequest;
    if (shouldRateLimit(max, window, data)) {
      const retryAfter = getRetryAfter(data.lastRequest, window);
      return rateLimitResponse(retryAfter);
    } else if (timeSinceLastRequest > window * 1e3) {
      await storage.set(
        key,
        {
          ...data,
          count: 1,
          lastRequest: now
        },
        true
      );
    } else {
      await storage.set(
        key,
        {
          ...data,
          count: data.count + 1,
          lastRequest: now
        },
        true
      );
    }
  }
}
function getDefaultSpecialRules() {
  const specialRules = [
    {
      pathMatcher(path) {
        return path.startsWith("/sign-in") || path.startsWith("/sign-up") || path.startsWith("/change-password") || path.startsWith("/change-email");
      },
      window: 10,
      max: 3
    }
  ];
  return specialRules;
}

function checkEndpointConflicts(options, logger2) {
  const endpointRegistry = /* @__PURE__ */ new Map();
  options.plugins?.forEach((plugin) => {
    if (plugin.endpoints) {
      for (const [key, endpoint] of Object.entries(plugin.endpoints)) {
        if (endpoint && "path" in endpoint) {
          const path = endpoint.path;
          let methods = [];
          if (endpoint.options && "method" in endpoint.options) {
            if (Array.isArray(endpoint.options.method)) {
              methods = endpoint.options.method;
            } else if (typeof endpoint.options.method === "string") {
              methods = [endpoint.options.method];
            }
          }
          if (methods.length === 0) {
            methods = ["*"];
          }
          if (!endpointRegistry.has(path)) {
            endpointRegistry.set(path, []);
          }
          endpointRegistry.get(path).push({
            pluginId: plugin.id,
            endpointKey: key,
            methods
          });
        }
      }
    }
  });
  const conflicts = [];
  for (const [path, entries] of endpointRegistry.entries()) {
    if (entries.length > 1) {
      const methodMap = /* @__PURE__ */ new Map();
      let hasConflict = false;
      for (const entry of entries) {
        for (const method of entry.methods) {
          if (!methodMap.has(method)) {
            methodMap.set(method, []);
          }
          methodMap.get(method).push(entry.pluginId);
          if (methodMap.get(method).length > 1) {
            hasConflict = true;
          }
          if (method === "*" && entries.length > 1) {
            hasConflict = true;
          } else if (method !== "*" && methodMap.has("*")) {
            hasConflict = true;
          }
        }
      }
      if (hasConflict) {
        const uniquePlugins = [...new Set(entries.map((e) => e.pluginId))];
        const conflictingMethods = [];
        for (const [method, plugins] of methodMap.entries()) {
          if (plugins.length > 1 || method === "*" && entries.length > 1 || method !== "*" && methodMap.has("*")) {
            conflictingMethods.push(method);
          }
        }
        conflicts.push({
          path,
          plugins: uniquePlugins,
          conflictingMethods
        });
      }
    }
  }
  if (conflicts.length > 0) {
    const conflictMessages = conflicts.map(
      (conflict) => `  - "${conflict.path}" [${conflict.conflictingMethods.join(", ")}] used by plugins: ${conflict.plugins.join(", ")}`
    ).join("\n");
    logger2.error(
      `Endpoint path conflicts detected! Multiple plugins are trying to use the same endpoint paths with conflicting HTTP methods:
${conflictMessages}

To resolve this, you can:
	1. Use only one of the conflicting plugins
	2. Configure the plugins to use different paths (if supported)
	3. Ensure plugins use different HTTP methods for the same path
`
    );
  }
}
function getEndpoints(ctx, options) {
  const pluginEndpoints = options.plugins?.reduce((acc, plugin) => {
    return {
      ...acc,
      ...plugin.endpoints
    };
  }, {}) ?? {};
  const middlewares = options.plugins?.map(
    (plugin) => plugin.middlewares?.map((m) => {
      const middleware = (async (context) => {
        const authContext = await ctx;
        return m.middleware({
          ...context,
          context: {
            ...authContext,
            ...context.context
          }
        });
      });
      middleware.options = m.middleware.options;
      return {
        path: m.path,
        middleware
      };
    })
  ).filter((plugin) => plugin !== void 0).flat() || [];
  const baseEndpoints = {
    signInSocial: socialProviders_index.signInSocial,
    callbackOAuth: socialProviders_index.callbackOAuth,
    getSession: session.getSession(),
    signOut: socialProviders_index.signOut,
    signUpEmail: signUpEmail(),
    signInEmail: socialProviders_index.signInEmail,
    forgetPassword: socialProviders_index.forgetPassword,
    resetPassword: socialProviders_index.resetPassword,
    verifyEmail: socialProviders_index.verifyEmail,
    sendVerificationEmail: socialProviders_index.sendVerificationEmail,
    changeEmail: socialProviders_index.changeEmail,
    changePassword: socialProviders_index.changePassword,
    setPassword: socialProviders_index.setPassword,
    updateUser: socialProviders_index.updateUser(),
    deleteUser: socialProviders_index.deleteUser,
    forgetPasswordCallback: socialProviders_index.forgetPasswordCallback,
    requestPasswordReset: socialProviders_index.requestPasswordReset,
    requestPasswordResetCallback: socialProviders_index.requestPasswordResetCallback,
    listSessions: session.listSessions(),
    revokeSession: session.revokeSession,
    revokeSessions: session.revokeSessions,
    revokeOtherSessions: session.revokeOtherSessions,
    linkSocialAccount: socialProviders_index.linkSocialAccount,
    listUserAccounts: socialProviders_index.listUserAccounts,
    deleteUserCallback: socialProviders_index.deleteUserCallback,
    unlinkAccount: socialProviders_index.unlinkAccount,
    refreshToken: socialProviders_index.refreshToken,
    getAccessToken: socialProviders_index.getAccessToken,
    accountInfo: socialProviders_index.accountInfo
  };
  const endpoints = {
    ...baseEndpoints,
    ...pluginEndpoints,
    ok: socialProviders_index.ok,
    error: socialProviders_index.error
  };
  const api = socialProviders_index.toAuthEndpoints(endpoints, ctx);
  return {
    api,
    middlewares
  };
}
const router = (ctx, options) => {
  const { api, middlewares } = getEndpoints(ctx, options);
  const basePath = new URL(ctx.baseURL).pathname;
  return betterCall.createRouter(api, {
    routerContext: ctx,
    openapi: {
      disabled: true
    },
    basePath,
    routerMiddleware: [
      {
        path: "/**",
        middleware: socialProviders_index.originCheckMiddleware
      },
      ...middlewares
    ],
    async onRequest(req) {
      const disabledPaths = ctx.options.disabledPaths || [];
      const path = new URL(req.url).pathname.replace(basePath, "");
      if (disabledPaths.includes(path)) {
        return new Response("Not Found", { status: 404 });
      }
      for (const plugin of ctx.options.plugins || []) {
        if (plugin.onRequest) {
          const response = await plugin.onRequest(req, ctx);
          if (response && "response" in response) {
            return response.response;
          }
        }
      }
      return onRequestRateLimit(req, ctx);
    },
    async onResponse(res) {
      for (const plugin of ctx.options.plugins || []) {
        if (plugin.onResponse) {
          const response = await plugin.onResponse(res, ctx);
          if (response) {
            return response.response;
          }
        }
      }
      return res;
    },
    onError(e) {
      if (e instanceof betterCall.APIError && e.status === "FOUND") {
        return;
      }
      if (options.onAPIError?.throw) {
        throw e;
      }
      if (options.onAPIError?.onError) {
        options.onAPIError.onError(e, ctx);
        return;
      }
      const optLogLevel = options.logger?.level;
      const log = optLogLevel === "error" || optLogLevel === "warn" || optLogLevel === "debug" ? logger.logger : void 0;
      if (options.logger?.disabled !== true) {
        if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
          if (e.message.includes("no column") || e.message.includes("column") || e.message.includes("relation") || e.message.includes("table") || e.message.includes("does not exist")) {
            ctx.logger?.error(e.message);
            return;
          }
        }
        if (e instanceof betterCall.APIError) {
          if (e.status === "INTERNAL_SERVER_ERROR") {
            ctx.logger.error(e.status, e);
          }
          log?.error(e.message);
        } else {
          ctx.logger?.error(
            e && typeof e === "object" && "name" in e ? e.name : "",
            e
          );
        }
      }
    }
  });
};

exports.APIError = betterCall.APIError;
exports.accountInfo = socialProviders_index.accountInfo;
exports.callbackOAuth = socialProviders_index.callbackOAuth;
exports.changeEmail = socialProviders_index.changeEmail;
exports.changePassword = socialProviders_index.changePassword;
exports.createEmailVerificationToken = socialProviders_index.createEmailVerificationToken;
exports.deleteUser = socialProviders_index.deleteUser;
exports.deleteUserCallback = socialProviders_index.deleteUserCallback;
exports.error = socialProviders_index.error;
exports.forgetPassword = socialProviders_index.forgetPassword;
exports.forgetPasswordCallback = socialProviders_index.forgetPasswordCallback;
exports.getAccessToken = socialProviders_index.getAccessToken;
exports.linkSocialAccount = socialProviders_index.linkSocialAccount;
exports.listUserAccounts = socialProviders_index.listUserAccounts;
exports.ok = socialProviders_index.ok;
exports.originCheck = socialProviders_index.originCheck;
exports.originCheckMiddleware = socialProviders_index.originCheckMiddleware;
exports.refreshToken = socialProviders_index.refreshToken;
exports.requestPasswordReset = socialProviders_index.requestPasswordReset;
exports.requestPasswordResetCallback = socialProviders_index.requestPasswordResetCallback;
exports.resetPassword = socialProviders_index.resetPassword;
exports.sendVerificationEmail = socialProviders_index.sendVerificationEmail;
exports.sendVerificationEmailFn = socialProviders_index.sendVerificationEmailFn;
exports.setPassword = socialProviders_index.setPassword;
exports.signInEmail = socialProviders_index.signInEmail;
exports.signInSocial = socialProviders_index.signInSocial;
exports.signOut = socialProviders_index.signOut;
exports.unlinkAccount = socialProviders_index.unlinkAccount;
exports.updateUser = socialProviders_index.updateUser;
exports.verifyEmail = socialProviders_index.verifyEmail;
exports.createAuthEndpoint = session.createAuthEndpoint;
exports.createAuthMiddleware = session.createAuthMiddleware;
exports.freshSessionMiddleware = session.freshSessionMiddleware;
exports.getSession = session.getSession;
exports.getSessionFromCtx = session.getSessionFromCtx;
exports.getSessionQuerySchema = session.getSessionQuerySchema;
exports.listSessions = session.listSessions;
exports.optionsMiddleware = session.optionsMiddleware;
exports.requestOnlySessionMiddleware = session.requestOnlySessionMiddleware;
exports.revokeOtherSessions = session.revokeOtherSessions;
exports.revokeSession = session.revokeSession;
exports.revokeSessions = session.revokeSessions;
exports.sensitiveSessionMiddleware = session.sensitiveSessionMiddleware;
exports.sessionMiddleware = session.sessionMiddleware;
exports.checkEndpointConflicts = checkEndpointConflicts;
exports.getEndpoints = getEndpoints;
exports.router = router;
exports.signUpEmail = signUpEmail;
