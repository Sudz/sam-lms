'use strict';

const z = require('zod');
require('better-call');
require('../../shared/better-auth.l_Ru3SGW.cjs');
const session = require('../../shared/better-auth.B0k5C6Ik.cjs');
require('../../shared/better-auth.B6fIklBU.cjs');
require('@better-auth/utils/base64');
require('@better-auth/utils/hmac');
require('../../shared/better-auth.BToNb2fI.cjs');
require('@better-auth/utils/binary');
require('@better-auth/core/db');
require('../../shared/better-auth.Bu93hUoT.cjs');
require('@better-auth/utils/random');
require('@better-auth/utils/hash');
require('@noble/ciphers/chacha.js');
require('@noble/ciphers/utils.js');
require('jose');
require('@noble/hashes/scrypt.js');
require('@better-auth/utils/hex');
require('@noble/hashes/utils.js');
require('../../shared/better-auth.CYeOI8C-.cjs');
require('kysely');
const pluginHelper = require('../../shared/better-auth.DNqtHmvg.cjs');
require('../../shared/better-auth.C1hdVENX.cjs');
require('../../crypto/index.cjs');
require('../../shared/better-auth.ANpbi45u.cjs');
require('@better-fetch/fetch');
require('../../shared/better-auth.DxBcELEX.cjs');
require('../../shared/better-auth.anw-08Z3.cjs');
require('../../shared/better-auth.Jlhc86WK.cjs');
require('jose/errors');
require('../../shared/better-auth.Bg6iw3ig.cjs');
require('defu');
require('../../shared/better-auth.uykCWCYS.cjs');

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

const getSessionQuerySchema = z__namespace.optional(
  z__namespace.object({
    /**
     * If cookie cache is enabled, it will disable the cache
     * and fetch the session from the database
     */
    disableCookieCache: z__namespace.boolean().meta({
      description: "Disable cookie cache and fetch session from database"
    }).or(z__namespace.string().transform((v) => v === "true")).optional(),
    disableRefresh: z__namespace.boolean().meta({
      description: "Disable session refresh. Useful for checking session status, without updating the session"
    }).optional()
  })
);
const customSession = (fn, options, pluginOptions) => {
  return {
    id: "custom-session",
    hooks: {
      after: [
        {
          matcher: (ctx) => ctx.path === "/multi-session/list-device-sessions" && (pluginOptions?.shouldMutateListDeviceSessionsEndpoint ?? false),
          handler: session.createAuthMiddleware(async (ctx) => {
            const response = await pluginHelper.getEndpointResponse(ctx);
            if (!response) return;
            const newResponse = await Promise.all(
              response.map(async (v) => await fn(v, ctx))
            );
            return ctx.json(newResponse);
          })
        }
      ]
    },
    endpoints: {
      getSession: session.createAuthEndpoint(
        "/get-session",
        {
          method: "GET",
          query: getSessionQuerySchema,
          metadata: {
            CUSTOM_SESSION: true,
            openapi: {
              description: "Get custom session data",
              responses: {
                "200": {
                  description: "Success",
                  content: {
                    "application/json": {
                      schema: {
                        type: "array",
                        nullable: true,
                        items: {
                          $ref: "#/components/schemas/Session"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          requireHeaders: true
        },
        async (ctx) => {
          const session$1 = await session.getSession()({
            ...ctx,
            asResponse: false,
            headers: ctx.headers,
            returnHeaders: true
          }).catch((e) => {
            return null;
          });
          if (!session$1?.response) {
            return ctx.json(null);
          }
          const fnResult = await fn(session$1.response, ctx);
          const setCookie = session$1.headers.get("set-cookie");
          if (setCookie) {
            ctx.setHeader("set-cookie", setCookie);
            session$1.headers.delete("set-cookie");
          }
          session$1.headers.forEach((value, key) => {
            ctx.setHeader(key, value);
          });
          return ctx.json(fnResult);
        }
      )
    }
  };
};

exports.customSession = customSession;
