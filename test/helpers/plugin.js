import isPlainObj from 'is-plain-obj'

const validateContext = function (context) {
  if (context !== undefined) {
    throw new Error('Defined context')
  }
}

export const TEST_PLUGIN = {
  name: 'prop',
  isOptions(prop) {
    // eslint-disable-next-line fp/no-this
    validateContext(this)
    return typeof prop === 'boolean' || isPlainObj(prop)
  },
  getOptions({ options, full }) {
    // eslint-disable-next-line fp/no-this
    validateContext(this)

    if (options === 'invalid') {
      throw new TypeError('Invalid prop')
    }

    if (options === 'partial' && full === false) {
      throw new TypeError('Partial')
    }

    return { prop: options, full }
  },
  properties(utils) {
    // eslint-disable-next-line fp/no-this
    validateContext(this)
    const toSet = isPlainObj(utils.options?.prop)
      ? utils.options?.prop.toSet
      : {}
    return { ...toSet, properties: { ...utils } }
  },
  instanceMethods: {
    getInstance(utils, ...args) {
      // eslint-disable-next-line fp/no-this
      validateContext(this)
      return { ...utils, args }
    },
  },
  staticMethods: {
    getProp(utils, ...args) {
      // eslint-disable-next-line fp/no-this
      validateContext(this)
      return { ...utils, args }
    },
  },
}
