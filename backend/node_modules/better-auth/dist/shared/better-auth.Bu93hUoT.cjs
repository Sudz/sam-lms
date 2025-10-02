'use strict';

const z = require('zod');
const betterCall = require('better-call');

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

const coreSchema = z__namespace.object({
  id: z__namespace.string(),
  createdAt: z__namespace.date().default(() => /* @__PURE__ */ new Date()),
  updatedAt: z__namespace.date().default(() => /* @__PURE__ */ new Date())
});
const accountSchema = coreSchema.extend({
  providerId: z__namespace.string(),
  accountId: z__namespace.string(),
  userId: z__namespace.coerce.string(),
  accessToken: z__namespace.string().nullish(),
  refreshToken: z__namespace.string().nullish(),
  idToken: z__namespace.string().nullish(),
  /**
   * Access token expires at
   */
  accessTokenExpiresAt: z__namespace.date().nullish(),
  /**
   * Refresh token expires at
   */
  refreshTokenExpiresAt: z__namespace.date().nullish(),
  /**
   * The scopes that the user has authorized
   */
  scope: z__namespace.string().nullish(),
  /**
   * Password is only stored in the credential provider
   */
  password: z__namespace.string().nullish()
});
const userSchema = coreSchema.extend({
  email: z__namespace.string().transform((val) => val.toLowerCase()),
  emailVerified: z__namespace.boolean().default(false),
  name: z__namespace.string(),
  image: z__namespace.string().nullish()
});
const sessionSchema = coreSchema.extend({
  userId: z__namespace.coerce.string(),
  expiresAt: z__namespace.date(),
  token: z__namespace.string(),
  ipAddress: z__namespace.string().nullish(),
  userAgent: z__namespace.string().nullish()
});
const verificationSchema = coreSchema.extend({
  value: z__namespace.string(),
  expiresAt: z__namespace.date(),
  identifier: z__namespace.string()
});
const cache = /* @__PURE__ */ new WeakMap();
function parseOutputData(data, schema) {
  const fields = schema.fields;
  const parsedData = {};
  for (const key in data) {
    const field = fields[key];
    if (!field) {
      parsedData[key] = data[key];
      continue;
    }
    if (field.returned === false) {
      continue;
    }
    parsedData[key] = data[key];
  }
  return parsedData;
}
function getAllFields(options, table) {
  if (!cache.has(options)) {
    cache.set(options, /* @__PURE__ */ new Map());
  }
  const tableCache = cache.get(options);
  if (tableCache.has(table)) {
    return tableCache.get(table);
  }
  let schema = {
    ...table === "user" ? options.user?.additionalFields : {},
    ...table === "session" ? options.session?.additionalFields : {}
  };
  for (const plugin of options.plugins || []) {
    if (plugin.schema && plugin.schema[table]) {
      schema = {
        ...schema,
        ...plugin.schema[table].fields
      };
    }
  }
  cache.get(options).set(table, schema);
  return schema;
}
function parseUserOutput(options, user) {
  const schema = getAllFields(options, "user");
  return parseOutputData(user, { fields: schema });
}
function parseAccountOutput(options, account) {
  const schema = getAllFields(options, "account");
  return parseOutputData(account, { fields: schema });
}
function parseSessionOutput(options, session) {
  const schema = getAllFields(options, "session");
  return parseOutputData(session, { fields: schema });
}
function parseInputData(data, schema) {
  const action = schema.action || "create";
  const fields = schema.fields;
  const parsedData = Object.assign(
    /* @__PURE__ */ Object.create(null),
    null
  );
  for (const key in fields) {
    if (key in data) {
      if (fields[key].input === false) {
        if (fields[key].defaultValue) {
          parsedData[key] = fields[key].defaultValue;
          continue;
        }
        if (parsedData[key]) {
          throw new betterCall.APIError("BAD_REQUEST", {
            message: `${key} is not allowed to be set`
          });
        }
        continue;
      }
      if (fields[key].validator?.input && data[key] !== void 0) {
        parsedData[key] = fields[key].validator.input.parse(data[key]);
        continue;
      }
      if (fields[key].transform?.input && data[key] !== void 0) {
        parsedData[key] = fields[key].transform?.input(data[key]);
        continue;
      }
      parsedData[key] = data[key];
      continue;
    }
    if (fields[key].defaultValue && action === "create") {
      parsedData[key] = fields[key].defaultValue;
      continue;
    }
    if (fields[key].required && action === "create") {
      throw new betterCall.APIError("BAD_REQUEST", {
        message: `${key} is required`
      });
    }
  }
  return parsedData;
}
function parseUserInput(options, user = {}, action) {
  const schema = getAllFields(options, "user");
  return parseInputData(user, { fields: schema, action });
}
function parseAdditionalUserInput(options, user) {
  const schema = getAllFields(options, "user");
  return parseInputData(user || {}, { fields: schema });
}
function parseAccountInput(options, account) {
  const schema = getAllFields(options, "account");
  return parseInputData(account, { fields: schema });
}
function parseSessionInput(options, session) {
  const schema = getAllFields(options, "session");
  return parseInputData(session, { fields: schema });
}
function mergeSchema(schema, newSchema) {
  if (!newSchema) {
    return schema;
  }
  for (const table in newSchema) {
    const newModelName = newSchema[table]?.modelName;
    if (newModelName) {
      schema[table].modelName = newModelName;
    }
    for (const field in schema[table].fields) {
      const newField = newSchema[table]?.fields?.[field];
      if (!newField) {
        continue;
      }
      schema[table].fields[field].fieldName = newField;
    }
  }
  return schema;
}

exports.accountSchema = accountSchema;
exports.coreSchema = coreSchema;
exports.mergeSchema = mergeSchema;
exports.parseAccountInput = parseAccountInput;
exports.parseAccountOutput = parseAccountOutput;
exports.parseAdditionalUserInput = parseAdditionalUserInput;
exports.parseInputData = parseInputData;
exports.parseSessionInput = parseSessionInput;
exports.parseSessionOutput = parseSessionOutput;
exports.parseUserInput = parseUserInput;
exports.parseUserOutput = parseUserOutput;
exports.sessionSchema = sessionSchema;
exports.userSchema = userSchema;
exports.verificationSchema = verificationSchema;
