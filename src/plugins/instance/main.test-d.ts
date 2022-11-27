import { expectAssignable, expectNotAssignable } from 'tsd'

import type { Info, Plugin } from 'modern-errors'

const name = 'test' as const

expectAssignable<Plugin>({
  name,
  instanceMethods: {
    instanceMethod: (info: Info['instanceMethods'], one: '', two: '') => '',
  },
})
expectAssignable<Plugin>({ name, instanceMethods: {} })
expectNotAssignable<Plugin>({ name, instanceMethods: true })
expectNotAssignable<Plugin>({ name, instanceMethods: { instanceMethod: true } })
expectNotAssignable<Plugin>({
  name,
  instanceMethods: { instanceMethod: (info: true) => '' },
})
expectNotAssignable<Plugin>({
  name,
  instanceMethods: { instanceMethod: (info: { one: '' }) => '' },
})
