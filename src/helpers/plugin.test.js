import isPlainObj from 'is-plain-obj'

import { getClasses } from './main.test.js'

const validateContext = (context) => {
  if (context !== undefined) {
    throw new Error('Defined context')
  }
}

const addInstancesData = (info, originalInfo) =>
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(
    info,
    'instancesData',
    Object.getOwnPropertyDescriptor(originalInfo, 'instancesData'),
  )

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
    return { ...toSet, properties: addInstancesData({ ...info }, info) }
  },
  instanceMethods: {
    getInstance(info, ...args) {
      // eslint-disable-next-line fp/no-this
      validateContext(this)
      return addInstancesData({ ...info, args }, info)
    },
  },
  staticMethods: {
    getProp(info, ...args) {
      // eslint-disable-next-line fp/no-this
      validateContext(this)
      return addInstancesData({ ...info, args }, info)
    },
  },
}

export const getPluginClasses = () => getClasses({ plugins: [TEST_PLUGIN] })

export const { ErrorClasses, ErrorSubclasses } = getPluginClasses()
