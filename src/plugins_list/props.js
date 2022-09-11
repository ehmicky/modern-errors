// eslint-disable-next-line filenames/match-exported
import { excludeKeys } from 'filter-obj'
import isPlainObj from 'is-plain-obj'
import setErrorProps from 'set-error-props'

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
const OMITTED_PROPS = ['wrap']

// `props` are shallowly merged, so we also shallowly unset them
// We make sure `props` ignored by `set-error-props` during `plugin.set()`,
// e.g. core error properties, are also ignored during `plugin.unset()`.
const unsetProps = function ({ error, options: props }) {
  // eslint-disable-next-line fp/no-loops
  for (const key of Reflect.ownKeys(setErrorProps({}, props))) {
    // eslint-disable-next-line fp/no-delete
    delete error[key]
  }
}

// Set `props` option as error properties
const setProps = function ({ error, options: props }) {
  setErrorProps(error, props)
}

const PROPS_PLUGIN = {
  name: 'props',
  normalize: normalizeProps,
  unset: unsetProps,
  set: setProps,
}

// eslint-disable-next-line import/no-default-export
export default PROPS_PLUGIN
