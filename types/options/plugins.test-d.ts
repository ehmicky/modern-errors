import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import modernErrors, {
  Plugin,
  GlobalOptions,
  ClassOptions,
  InstanceOptions,
  MethodOptions,
} from '../main.js'

const name = 'test'
const barePlugin = { name } as const
const plugin = { ...barePlugin, getOptions: (input: true) => input }

const PAnyError = modernErrors([plugin])
const PSError = PAnyError.subclass('PSError')

expectError(modernErrors([barePlugin], { test: true }))

modernErrors([plugin], { test: true })
PAnyError.subclass('TestError', { test: true })
new PAnyError('', { test: true })
new PSError('', { test: true })
expectAssignable<GlobalOptions<[typeof plugin]>>({ test: true })
expectAssignable<ClassOptions<[typeof plugin]>>({ test: true })
expectAssignable<InstanceOptions<[typeof plugin]>>({ test: true })
expectAssignable<MethodOptions<typeof plugin>>(true)

expectError(modernErrors([plugin], { test: 'true' }))
expectError(PAnyError.subclass('TestError', { test: 'true' }))
expectError(new PAnyError('', { test: 'true' }))
expectError(new PSError('', { test: 'true' }))
expectNotAssignable<GlobalOptions<[typeof plugin]>>({ test: 'true' })
expectNotAssignable<ClassOptions<[typeof plugin]>>({ test: 'true' })
expectNotAssignable<InstanceOptions<[typeof plugin]>>({ test: 'true' })
expectNotAssignable<MethodOptions<typeof plugin>>('true')

expectError(modernErrors([], { other: true }))
expectError(modernErrors([plugin as Plugin], { other: true }))
expectError(modernErrors([{ ...plugin, name: '' as string }], { other: true }))
expectError(new PAnyError('', { cause: '', other: true }))
expectError(new PSError('', { other: true }))
expectError(new PSError('', { cause: '', other: true }))
expectNotAssignable<GlobalOptions>({ other: true })
expectNotAssignable<ClassOptions>({ other: true })
expectNotAssignable<InstanceOptions>({ other: true })

expectAssignable<InstanceOptions>({})
expectAssignable<GlobalOptions>({})
expectAssignable<ClassOptions>({})
expectAssignable<MethodOptions<typeof barePlugin>>({} as never)

expectNotAssignable<InstanceOptions>(true)
expectNotAssignable<GlobalOptions>(true)
expectNotAssignable<ClassOptions>(true)
expectNotAssignable<MethodOptions<typeof barePlugin>>(true)

expectAssignable<Plugin>({
  name,
  getOptions: (input: true, full: boolean) => input,
})
expectAssignable<Plugin>({ name, getOptions: () => true })
expectNotAssignable<Plugin>({ name, getOptions: true })
expectNotAssignable<Plugin>({
  name,
  getOptions: (input: true, full: string) => input,
})

expectAssignable<Plugin>({ name, isOptions: (input: unknown) => true })
expectNotAssignable<Plugin>({ name, isOptions: true })
expectNotAssignable<Plugin>({ name, isOptions: (input: true) => true })
expectNotAssignable<Plugin>({ name, isOptions: (input: unknown) => 0 })
