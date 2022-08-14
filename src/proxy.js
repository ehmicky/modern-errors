// `create-error-types` return value is a `Proxy`. We return it as is, but add
// more properties. We use an outer `Proxy` to do so.
export const proxyProps = function (returnValue, innerProxy) {
  // eslint-disable-next-line fp/no-proxy
  return new Proxy(returnValue, getProxyHooks(innerProxy))
}

const getProxyHooks = function (innerProxy) {
  return Object.fromEntries(
    HOOK_NAMES.map((hookName) => [
      hookName,
      getProxyProp.bind(undefined, innerProxy, hookName),
    ]),
  )
}

const HOOK_NAMES = ['get', 'has', 'getOwnPropertyDescriptor']

// eslint-disable-next-line max-params
const getProxyProp = function (
  innerProxy,
  hookName,
  target,
  propName,
  ...args
) {
  if (!(propName in target) && propName in innerProxy) {
    Reflect.set(target, propName, innerProxy[propName], ...args)
  }

  return Reflect[hookName](target, propName, ...args)
}
