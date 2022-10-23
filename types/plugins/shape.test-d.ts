import { expectAssignable, expectNotAssignable } from 'tsd'

import { Plugin } from '../main.js'

const name = 'test' as const
expectAssignable<Plugin>({ name })
expectNotAssignable<Plugin>({})
expectNotAssignable<Plugin>({ name, unknown: true })
