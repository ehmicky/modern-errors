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
  getOptions(prop, full) {
    // eslint-disable-next-line fp/no-this
    validateContext(this)

    if (prop === 'invalid') {
      throw new TypeError('Invalid prop')
    }

    if (prop === 'partial' && full === false) {
      throw new TypeError('Partial')
    }

    return { prop, full }
  },
  properties(info) {
    // eslint-disable-next-line fp/no-this
    validateContext(this)
    const toSet = isPlainObj(info.options?.prop) ? info.options?.prop.toSet : {}
    return { ...toSet, properties: { ...info } }
  },
  instanceMethods: {
    getInstance(info, ...args) {
      // eslint-disable-next-line fp/no-this
      validateContext(this)
      return { ...info, args }
    },
  },
  staticMethods: {
    getProp(info, ...args) {
      // eslint-disable-next-line fp/no-this
      validateContext(this)
      return { ...info, args }
    },
  },
}
