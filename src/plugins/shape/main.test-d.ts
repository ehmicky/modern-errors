import type { Plugin } from 'modern-errors'
import { expectAssignable, expectNotAssignable } from 'tsd'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const name = 'test' as const
expectAssignable<Plugin>({ name })
expectNotAssignable<Plugin>({})
expectNotAssignable<Plugin>({ name, unknown: true })
