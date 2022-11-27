import { expectAssignable, expectNotAssignable } from 'tsd'

import type { Plugin } from 'modern-errors'

const name = 'test' as const
expectAssignable<Plugin>({ name })
expectNotAssignable<Plugin>({})
expectNotAssignable<Plugin>({ name, unknown: true })
