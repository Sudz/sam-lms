import { APIError } from 'better-call';
import '../../shared/better-auth.CpZXDeOc.mjs';
import '../../shared/better-auth.D_jpufHc.mjs';
import 'zod';
import '../../shared/better-auth.CiuwFiHM.mjs';
import '@better-auth/utils/base64';
import '@better-auth/utils/hmac';
import '../../shared/better-auth.DgGir396.mjs';
import '@better-auth/utils/binary';
import '@better-auth/core/db';
import '../../shared/better-auth.BZghgUMh.mjs';
import '@better-auth/utils/random';
import { createHash } from '@better-auth/utils/hash';
import '@noble/ciphers/chacha.js';
import '@noble/ciphers/utils.js';
import 'jose';
import '@noble/hashes/scrypt.js';
import '@better-auth/utils/hex';
import '@noble/hashes/utils.js';
import '../../shared/better-auth.B4Qoxdgc.mjs';
import 'kysely';
import { betterFetch } from '@better-fetch/fetch';
import '../../shared/better-auth.CW6D9eSx.mjs';
import '../../crypto/index.mjs';
import '../../shared/better-auth.DdzSJf-n.mjs';
import '../../shared/better-auth.BAQSo96z.mjs';
import '../../shared/better-auth.L4mY8Wf-.mjs';
import '../../shared/better-auth.BTrSrKsi.mjs';
import 'jose/errors';
import '../../shared/better-auth.BUPPRXfK.mjs';
import 'defu';
import '../../shared/better-auth.D2xndZ2p.mjs';

const ERROR_CODES = {
  PASSWORD_COMPROMISED: "The password you entered has been compromised. Please choose a different password."
};
async function checkPasswordCompromise(password, customMessage) {
  if (!password) return;
  const sha1Hash = (await createHash("SHA-1", "hex").digest(password)).toUpperCase();
  const prefix = sha1Hash.substring(0, 5);
  const suffix = sha1Hash.substring(5);
  try {
    const { data, error } = await betterFetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
      {
        headers: {
          "Add-Padding": "true",
          "User-Agent": "BetterAuth Password Checker"
        }
      }
    );
    if (error) {
      throw new APIError("INTERNAL_SERVER_ERROR", {
        message: `Failed to check password. Status: ${error.status}`
      });
    }
    const lines = data.split("\n");
    const found = lines.some(
      (line) => line.split(":")[0].toUpperCase() === suffix.toUpperCase()
    );
    if (found) {
      throw new APIError("BAD_REQUEST", {
        message: customMessage || ERROR_CODES.PASSWORD_COMPROMISED,
        code: "PASSWORD_COMPROMISED"
      });
    }
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: "Failed to check password. Please try again later."
    });
  }
}
const haveIBeenPwned = (options) => ({
  id: "haveIBeenPwned",
  init(ctx) {
    return {
      context: {
        password: {
          ...ctx.password,
          async hash(password) {
            await checkPasswordCompromise(
              password,
              options?.customPasswordCompromisedMessage
            );
            return ctx.password.hash(password);
          }
        }
      }
    };
  },
  $ERROR_CODES: ERROR_CODES
});

export { haveIBeenPwned };
