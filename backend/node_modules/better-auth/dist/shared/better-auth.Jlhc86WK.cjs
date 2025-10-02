'use strict';

const logger = require('./better-auth.BToNb2fI.cjs');

function safeJSONParse(data) {
  function reviver(_, value) {
    if (typeof value === "string") {
      const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
      if (iso8601Regex.test(value)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }
    return value;
  }
  try {
    if (typeof data !== "string") {
      return data;
    }
    return JSON.parse(data, reviver);
  } catch (e) {
    logger.logger.error("Error parsing JSON", { error: e });
    return null;
  }
}

exports.safeJSONParse = safeJSONParse;
