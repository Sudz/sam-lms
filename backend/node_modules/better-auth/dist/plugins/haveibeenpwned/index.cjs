'use strict';

const betterCall = require('better-call');
require('../../shared/better-auth.l_Ru3SGW.cjs');
require('../../shared/better-auth.B0k5C6Ik.cjs');
require('zod');
require('../../shared/better-auth.B6fIklBU.cjs');
require('@better-auth/utils/base64');
require('@better-auth/utils/hmac');
require('../../shared/better-auth.BToNb2fI.cjs');
require('@better-auth/utils/binary');
require('@better-auth/core/db');
require('../../shared/better-auth.Bu93hUoT.cjs');
require('@better-auth/utils/random');
const hash = require('@better-auth/utils/hash');
require('@noble/ciphers/chacha.js');
require('@noble/ciphers/utils.js');
require('jose');
require('@noble/hashes/scrypt.js');
require('@better-auth/utils/hex');
require('@noble/hashes/utils.js');
require('../../shared/better-auth.CYeOI8C-.cjs');
require('kysely');
const fetch = require('@better-fetch/fetch');
require('../../shared/better-auth.C1hdVENX.cjs');
require('../../crypto/index.cjs');
require('../../shared/better-auth.ANpbi45u.cjs');
require('../../shared/better-auth.DxBcELEX.cjs');
require('../../shared/better-auth.anw-08Z3.cjs');
require('../../shared/better-auth.Jlhc86WK.cjs');
require('jose/errors');
require('../../shared/better-auth.Bg6iw3ig.cjs');
require('defu');
require('../../shared/better-auth.uykCWCYS.cjs');

const ERROR_CODES = {
  PASSWORD_COMPROMISED: "The password you entered has been compromised. Please choose a different password."
};
async function checkPasswordCompromise(password, customMessage) {
  if (!password) return;
  const sha1Hash = (await hash.createHash("SHA-1", "hex").digest(password)).toUpperCase();
  const prefix = sha1Hash.substring(0, 5);
  const suffix = sha1Hash.substring(5);
  try {
    const { data, error } = await fetch.betterFetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
      {
        headers: {
          "Add-Padding": "true",
          "User-Agent": "BetterAuth Password Checker"
        }
      }
    );
    if (error) {
      throw new betterCall.APIError("INTERNAL_SERVER_ERROR", {
        message: `Failed to check password. Status: ${error.status}`
      });
    }
    const lines = data.split("\n");
    const found = lines.some(
      (line) => line.split(":")[0].toUpperCase() === suffix.toUpperCase()
    );
    if (found) {
      throw new betterCall.APIError("BAD_REQUEST", {
        message: customMessage || ERROR_CODES.PASSWORD_COMPROMISED,
        code: "PASSWORD_COMPROMISED"
      });
    }
  } catch (error) {
    if (error instanceof betterCall.APIError) throw error;
    throw new betterCall.APIError("INTERNAL_SERVER_ERROR", {
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

exports.haveIBeenPwned = haveIBeenPwned;
