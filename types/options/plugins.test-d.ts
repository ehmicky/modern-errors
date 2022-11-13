import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import ModernError, {
  Plugin,
  ClassOptions,
  InstanceOptions,
  MethodOptions,
} from 'modern-errors'

const barePlugin = { name: 'test' as const }
const fullPlugin = { ...barePlugin, getOptions: (input: true) => input }

const BaseError = ModernError.subclass('BaseError', { plugins: [fullPlugin] })

expectError(
  ModernError.subclass('TestError', { plugins: [barePlugin], test: true }),
)

ModernError.subclass('TestError', { plugins: [fullPlugin], test: true })
BaseError.subclass('TestError', { test: true })
new BaseError('', { test: true })
expectAssignable<ClassOptions<[typeof fullPlugin]>>({ test: true })
expectAssignable<InstanceOptions<[typeof fullPlugin]>>({ test: true })
expectAssignable<MethodOptions<typeof fullPlugin>>(true)

expectError(
  ModernError.subclass('TestError', { plugins: [fullPlugin], test: 'true' }),
)
expectError(BaseError.subclass('TestError', { test: 'true' }))
expectError(new BaseError('', { test: 'true' }))
expectNotAssignable<ClassOptions<[typeof fullPlugin]>>({ test: 'true' })
expectNotAssignable<InstanceOptions<[typeof fullPlugin]>>({ test: 'true' })
expectNotAssignable<MethodOptions<typeof fullPlugin>>('true')

expectError(ModernError.subclass('TestError', { other: true }))
expectError(
  ModernError.subclass('TestError', {
    plugins: [fullPlugin as Plugin],
    other: true,
  }),
)
expectError(
  ModernError.subclass('TestError', {
    plugins: [{ ...fullPlugin, name: '' as string }],
    other: true,
  }),
)
expectError(new BaseError('', { other: true }))
expectNotAssignable<ClassOptions>({ other: true })
expectNotAssignable<InstanceOptions>({ other: true })

expectAssignable<InstanceOptions>({})
expectAssignable<ClassOptions>({})
expectAssignable<MethodOptions<typeof barePlugin>>({} as never)

expectNotAssignable<InstanceOptions>(true)
expectNotAssignable<ClassOptions>(true)
expectNotAssignable<MethodOptions<typeof barePlugin>>(true)
