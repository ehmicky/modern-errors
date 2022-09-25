export const TEST_PLUGIN = {
  name: 'prop',
  isOptions({ options: prop }) {
    return prop !== 'notOptions'
  },
  normalize({ options: prop, full }) {
    if (prop === 'invalid') {
      throw new TypeError('Invalid prop')
    }

    if (prop === 'partial' && full === false) {
      throw new TypeError('Partial')
    }

    // eslint-disable-next-line fp/no-this
    return { prop, context: this, full }
  },
  unset(utils) {
    const { error } = utils
    // eslint-disable-next-line fp/no-this
    error.unset = { ...utils, context: this }
  },
  set(utils) {
    const { error } = utils
    // eslint-disable-next-line fp/no-this
    error.set = { ...utils, context: this }
  },
  instanceMethods: {
    getInstance(utils, ...args) {
      // eslint-disable-next-line fp/no-this
      return { ...utils, args, context: this }
    },
  },
  staticMethods: {
    getProp(utils, ...args) {
      // eslint-disable-next-line fp/no-this
      return { ...utils, args, context: this }
    },
  },
}
