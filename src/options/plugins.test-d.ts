import { expectAssignable, expectNotAssignable } from 'tsd'

import ModernError, {
  type Plugin,
  type ClassOptions,
  type InstanceOptions,
  type MethodOptions,
} from 'modern-errors'

const barePlugin = { name: 'test' as const }
const fullPlugin = { ...barePlugin, getOptions: (input: true) => input }

const BaseError = ModernError.subclass('BaseError', { plugins: [fullPlugin] })

// @ts-expect-error
ModernError.subclass('TestError', { plugins: [barePlugin], test: true })
ModernError.subclass('TestError', { plugins: [fullPlugin], test: true })
BaseError.subclass('TestError', { test: true })
new BaseError('', { test: true })
expectNotAssignable<ClassOptions>({ test: true })
expectAssignable<ClassOptions<[typeof fullPlugin]>>({ test: true })
expectNotAssignable<InstanceOptions>({ test: true })
expectAssignable<InstanceOptions<[typeof fullPlugin]>>({ test: true })
expectAssignable<MethodOptions<typeof fullPlugin>>(true)

// @ts-expect-error
ModernError.subclass('TestError', { plugins: [barePlugin], test: 'true' })
// @ts-expect-error
ModernError.subclass('TestError', { plugins: [fullPlugin], test: 'true' })
// @ts-expect-error
BaseError.subclass('TestError', { test: 'true' })
// @ts-expect-error
new BaseError('', { test: 'true' })
expectNotAssignable<ClassOptions>({ test: 'true' })
expectNotAssignable<ClassOptions<[typeof fullPlugin]>>({ test: 'true' })
expectNotAssignable<InstanceOptions>({ test: 'true' })
expectNotAssignable<InstanceOptions<[typeof fullPlugin]>>({ test: 'true' })
expectNotAssignable<MethodOptions<typeof fullPlugin>>('true')

// @ts-expect-error
ModernError.subclass('TestError', { other: true })
// @ts-expect-error
ModernError.subclass('TestError', { plugins: [barePlugin], other: true })
// @ts-expect-error
ModernError.subclass('TestError', { plugins: [fullPlugin], other: true })
ModernError.subclass('TestError', {
  plugins: [fullPlugin as Plugin],
  // @ts-expect-error
  other: true,
})
ModernError.subclass('TestError', {
  plugins: [{ ...fullPlugin, name: '' as string }],
  // @ts-expect-error
  other: true,
})
// @ts-expect-error
new BaseError('', { other: true })
expectNotAssignable<ClassOptions>({ other: true })
expectNotAssignable<ClassOptions<[typeof fullPlugin]>>({ other: true })
expectNotAssignable<InstanceOptions>({ other: true })
expectNotAssignable<InstanceOptions<[typeof fullPlugin]>>({ other: true })

ModernError.subclass('TestError', {})
ModernError.subclass('TestError', { plugins: [barePlugin] })
ModernError.subclass('TestError', { plugins: [fullPlugin] })
BaseError.subclass('TestError', {})
expectAssignable<ClassOptions>({})
expectAssignable<ClassOptions<[typeof fullPlugin]>>({})
expectAssignable<InstanceOptions>({})
expectAssignable<InstanceOptions<[typeof fullPlugin]>>({})
expectAssignable<MethodOptions<typeof barePlugin>>({} as never)

expectNotAssignable<ClassOptions>(true)
expectNotAssignable<ClassOptions<[typeof fullPlugin]>>(true)
expectNotAssignable<InstanceOptions>(true)
expectNotAssignable<InstanceOptions<[typeof fullPlugin]>>(true)
expectNotAssignable<MethodOptions<typeof barePlugin>>(true)

const secondPlugin = { ...fullPlugin, name: 'second' as const }
const SecondPluginError = BaseError.subclass('SecondPluginError', {
  plugins: [secondPlugin],
  test: true,
  second: true,
})
new SecondPluginError('', { test: true, second: true })
// @ts-expect-error
new SecondPluginError('', { test: 'true' })
// @ts-expect-error
new SecondPluginError('', { second: 'true' })
// @ts-expect-error
new SecondPluginError('', { other: true })
