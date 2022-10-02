import isPlainObj from 'is-plain-obj'

// Error properties can be set using the `props` option
const getOptions = function (options = {}) {
  if (!isPlainObj(options)) {
    throw new TypeError(`It must be a plain object: ${options}`)
  }

  // eslint-disable-next-line no-unused-vars
  const { message, ...optionsA } = options
  return optionsA
}

// Set `props` option as error properties
const properties = function ({ options }) {
  return options
}

// eslint-disable-next-line import/no-default-export
export default {
  name: 'props',
  getOptions,
  properties,
}
