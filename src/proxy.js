import { createCustomError } from './types.js'

// We return a `Proxy` so that users do not need to type error names twice,
// both as argument and as they destructure the return value.
// This creates some magic which be unexpected but removes the main argument
// of the main export function, so this simplifies the developer experience.
// Each time an ErrorType is retrieved from the proxy, it is persisted, so that:
//  - Each error type is created only once
//  - Enumerating the return value works
export const createProxy = function (state, onCreate) {
  // eslint-disable-next-line fp/no-proxy
  return new Proxy(state, { get: getProxyProp.bind(undefined, onCreate) })
}

// eslint-disable-next-line max-params
const getProxyProp = function (onCreate, target, propName, receiver) {
  if (!(propName in target)) {
    const ErrorType = createCustomError(propName, onCreate)
    Reflect.set(target, propName, ErrorType, receiver)
  }

  return Reflect.get(target, propName, receiver)
}
