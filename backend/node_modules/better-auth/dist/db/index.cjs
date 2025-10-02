'use strict';

const db = require('@better-auth/core/db');
const getMigration = require('../shared/better-auth.DAx40NmY.cjs');
const getTables = require('../shared/better-auth.S3hDEI-1.cjs');
const toZod = require('../shared/better-auth.CsC4FSOQ.cjs');
const schema = require('../shared/better-auth.Bu93hUoT.cjs');
require('../shared/better-auth.C1hdVENX.cjs');
require('../shared/better-auth.D1rR7ww4.cjs');
require('../shared/better-auth.B6fIklBU.cjs');
require('zod');
require('../shared/better-auth.Jlhc86WK.cjs');
require('../shared/better-auth.BToNb2fI.cjs');
require('../shared/better-auth.Bg6iw3ig.cjs');
require('@better-auth/utils/random');
require('better-call');
require('@better-auth/utils/hash');
require('@noble/ciphers/chacha.js');
require('@noble/ciphers/utils.js');
require('@better-auth/utils/base64');
require('jose');
require('@noble/hashes/scrypt.js');
require('@better-auth/utils/hex');
require('@noble/hashes/utils.js');
require('../shared/better-auth.CYeOI8C-.cjs');
require('../shared/better-auth.ANpbi45u.cjs');
require('../shared/better-auth.DhuXIuMp.cjs');
require('kysely');
require('../shared/better-auth.B3DNJnq5.cjs');
require('../shared/better-auth.De2uf6ue.cjs');

const createFieldAttribute = (type, config) => {
  return {
    type,
    ...config
  };
};

exports.convertFromDB = getMigration.convertFromDB;
exports.convertToDB = getMigration.convertToDB;
exports.createInternalAdapter = getMigration.createInternalAdapter;
exports.getAdapter = getMigration.getAdapter;
exports.getMigrations = getMigration.getMigrations;
exports.getSchema = getMigration.getSchema;
exports.getWithHooks = getMigration.getWithHooks;
exports.matchType = getMigration.matchType;
exports.getAuthTables = getTables.getAuthTables;
exports.toZodSchema = toZod.toZodSchema;
exports.accountSchema = schema.accountSchema;
exports.coreSchema = schema.coreSchema;
exports.mergeSchema = schema.mergeSchema;
exports.parseAccountInput = schema.parseAccountInput;
exports.parseAccountOutput = schema.parseAccountOutput;
exports.parseAdditionalUserInput = schema.parseAdditionalUserInput;
exports.parseInputData = schema.parseInputData;
exports.parseSessionInput = schema.parseSessionInput;
exports.parseSessionOutput = schema.parseSessionOutput;
exports.parseUserInput = schema.parseUserInput;
exports.parseUserOutput = schema.parseUserOutput;
exports.sessionSchema = schema.sessionSchema;
exports.userSchema = schema.userSchema;
exports.verificationSchema = schema.verificationSchema;
exports.createFieldAttribute = createFieldAttribute;
Object.prototype.hasOwnProperty.call(db, '__proto__') &&
	!Object.prototype.hasOwnProperty.call(exports, '__proto__') &&
	Object.defineProperty(exports, '__proto__', {
		enumerable: true,
		value: db['__proto__']
	});

Object.keys(db).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = db[k];
});
