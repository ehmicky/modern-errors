// `create-error-types` return value is a `Proxy`. We return it as is, but add
// more properties. We use an outer `Proxy` to do so.
export const proxyProps = function (returnValue, innerProxy) {
  // eslint-disable-next-line fp/no-proxy
  return new Proxy(returnValue, {
    get: getProxyProp.bind(undefined, innerProxy),
  })
}

// eslint-disable-next-line max-params
const getProxyProp = function (innerProxy, target, propName, receiver) {
  if (!(propName in target)) {
    setProxyProp({ innerProxy, target, propName, receiver })
  }

  return Reflect.get(target, propName, receiver)
}

const setProxyProp = function ({ innerProxy, target, propName, receiver }) {
  const ErrorType = innerProxy[propName]

  if (ErrorType !== undefined) {
    Reflect.set(target, propName, ErrorType, receiver)
  }
}
