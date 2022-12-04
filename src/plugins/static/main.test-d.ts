import type { Info, Plugin } from 'modern-errors'
import { expectAssignable, expectNotAssignable } from 'tsd'

const name = 'test' as const

expectAssignable<Plugin>({
  name,
  staticMethods: {
    staticMethod: (info: Info['staticMethods'], one: '', two: '') => '',
  },
})
expectAssignable<Plugin>({ name, staticMethods: {} })
expectNotAssignable<Plugin>({ name, staticMethods: true })
expectNotAssignable<Plugin>({ name, staticMethods: { staticMethod: true } })
expectNotAssignable<Plugin>({
  name,
  staticMethods: { staticMethod: (info: true) => '' },
})
expectNotAssignable<Plugin>({
  name,
  staticMethods: { staticMethod: (info: { one: '' }) => '' },
})
expectNotAssignable<Plugin>({
  name,
  staticMethods: { staticMethod: (info: Info['properties']) => '' },
})
expectNotAssignable<Plugin>({
  name,
  staticMethods: { staticMethod: (info: Info['instanceMethods']) => '' },
})
