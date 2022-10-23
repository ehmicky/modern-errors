import { expectAssignable, expectNotAssignable } from 'tsd'

import { Plugin } from '../main.js'

const name = 'test'
expectAssignable<Plugin>({ name })
expectNotAssignable<Plugin>({})
expectNotAssignable<Plugin>({ name, unknown: true })
