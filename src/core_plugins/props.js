// eslint-disable-next-line filenames/match-exported
import isPlainObj from 'is-plain-obj'

// Error properties can be set using the `props` option
const getOptions = function (props = {}) {
  if (!isPlainObj(props)) {
    throw new TypeError(`It must be a plain object: ${props}`)
  }

  // eslint-disable-next-line no-unused-vars
  const { message, ...propsA } = props
  return propsA
}

// Set `props` option as error properties
const properties = function ({ options }) {
  return options
}

const PROPS_PLUGIN = { name: 'props', getOptions, properties }

// eslint-disable-next-line import/no-default-export
export default PROPS_PLUGIN
