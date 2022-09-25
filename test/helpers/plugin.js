import isPlainObj from 'is-plain-obj'

const validateContext = function (context) {
  if (context !== undefined) {
    throw new Error('Defined context')
  }
}

export const TEST_PLUGIN = {
  name: 'prop',
  isOptions({ options: prop }) {
    // eslint-disable-next-line fp/no-this
    validateContext(this)
    return typeof prop === 'boolean' || isPlainObj(prop)
  },
  getOptions({ options: prop, full }) {
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
  unset(utils) {
    // eslint-disable-next-line fp/no-this
    validateContext(this)
    const toUnset = isPlainObj(utils.options?.prop)
      ? utils.options?.prop.toUnset
      : {}
    return { ...toUnset, unset: { ...utils } }
  },
  set(utils) {
    // eslint-disable-next-line fp/no-this
    validateContext(this)
    const toSet = isPlainObj(utils.options?.prop)
      ? utils.options?.prop.toSet
      : {}
    return { ...toSet, set: { ...utils } }
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
