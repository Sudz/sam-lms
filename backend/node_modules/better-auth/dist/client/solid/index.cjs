'use strict';

const proxy = require('../../shared/better-auth.CZNeES-1.cjs');
const misc = require('../../shared/better-auth.BLDOwz3i.cjs');
const store = require('solid-js/store');
const solidJs = require('solid-js');
require('@better-fetch/fetch');
require('../../shared/better-auth.DxBcELEX.cjs');
require('../../shared/better-auth.B6fIklBU.cjs');
require('../../shared/better-auth.ANpbi45u.cjs');
require('nanostores');
require('../../shared/better-auth.D9AYOecd.cjs');
require('../../shared/better-auth.DUNU0obG.cjs');

function useStore(store$1) {
  const unbindActivation = store$1.listen(() => {
  });
  const [state, setState] = store.createStore({
    value: store$1.get()
  });
  const unsubscribe = store$1.subscribe((newValue) => {
    setState("value", store.reconcile(newValue));
  });
  solidJs.onCleanup(() => unsubscribe());
  unbindActivation();
  return () => state.value;
}

function getAtomKey(str) {
  return `use${misc.capitalizeFirstLetter(str)}`;
}
function createAuthClient(options) {
  const {
    pluginPathMethods,
    pluginsActions,
    pluginsAtoms,
    $fetch,
    atomListeners
  } = proxy.getClientConfig(options);
  let resolvedHooks = {};
  for (const [key, value] of Object.entries(pluginsAtoms)) {
    resolvedHooks[getAtomKey(key)] = () => useStore(value);
  }
  const routes = {
    ...pluginsActions,
    ...resolvedHooks
  };
  const proxy$1 = proxy.createDynamicPathProxy(
    routes,
    $fetch,
    pluginPathMethods,
    pluginsAtoms,
    atomListeners
  );
  return proxy$1;
}

exports.createAuthClient = createAuthClient;
