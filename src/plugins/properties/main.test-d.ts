import { expectAssignable, expectNotAssignable } from 'tsd'

import { Info, Plugin } from 'modern-errors'

const name = 'test' as const
const emptyPlugin = { name }
const fullPlugin = {
  ...emptyPlugin,
  properties: (info: Info['properties']) => ({ property: true } as const),
}

expectAssignable<Plugin>(fullPlugin)
expectNotAssignable<Plugin>({ name, properties: true })
expectNotAssignable<Plugin>({ name, properties: (info: true) => ({}) })
expectNotAssignable<Plugin>({ name, properties: (info: { one: '' }) => ({}) })
expectNotAssignable<Plugin>({
  name,
  properties: (info: Info['properties'], arg: true) => ({}),
})
expectNotAssignable<Plugin>({
  name,
  properties: (info: Info['properties']) => true,
})
expectNotAssignable<Plugin>({
  name,
  properties: (info: Info['properties']) => [],
})
