'use strict';

const vanilla = require('../shared/better-auth.BCLoxHEa.cjs');
const query = require('../shared/better-auth.D9AYOecd.cjs');
require('../shared/better-auth.CZNeES-1.cjs');
require('@better-fetch/fetch');
require('../shared/better-auth.DxBcELEX.cjs');
require('../shared/better-auth.B6fIklBU.cjs');
require('../shared/better-auth.ANpbi45u.cjs');
require('nanostores');
require('../shared/better-auth.DUNU0obG.cjs');
require('../shared/better-auth.BLDOwz3i.cjs');

const InferPlugin = () => {
  return {
    id: "infer-server-plugin",
    $InferServerPlugin: {}
  };
};
function InferAuth() {
  return {};
}

exports.createAuthClient = vanilla.createAuthClient;
exports.useAuthQuery = query.useAuthQuery;
exports.InferAuth = InferAuth;
exports.InferPlugin = InferPlugin;
