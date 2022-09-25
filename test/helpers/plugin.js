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
  normalize({ options: prop, full }) {
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
    const { error } = utils
    error.unset = { ...utils }
  },
  set(utils) {
    // eslint-disable-next-line fp/no-this
    validateContext(this)
    const { error } = utils
    error.set = { ...utils }
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
