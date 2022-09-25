// eslint-disable-next-line filenames/match-exported
import { excludeKeys } from 'filter-obj'
import isPlainObj from 'is-plain-obj'

// Error properties can be set using the `props` option
const normalizeProps = function ({ options: props = {} }) {
  if (!isPlainObj(props)) {
    throw new TypeError(`"props" option must be a plain object: ${props}`)
  }

  return excludeKeys(props, OMITTED_PROPS)
}

// Reserved top-level properties do not throw: they are silently omitted instead
// since `props` might be dynamically generated making it cumbersome for user to
// filter those.
const OMITTED_PROPS = ['wrap', 'constructorArgs', 'message']

// Set `props` option as error properties
const setProps = function ({ options }) {
  return options
}

const unsetProps = function ({ options }) {
  return Object.assign({}, ...Reflect.ownKeys(options).map(getUnsetProp))
}

const getUnsetProp = function (key) {
  return { [key]: undefined }
}

const PROPS_PLUGIN = {
  name: 'props',
  normalize: normalizeProps,
  set: setProps,
  unset: unsetProps,
}

// eslint-disable-next-line import/no-default-export
export default PROPS_PLUGIN
