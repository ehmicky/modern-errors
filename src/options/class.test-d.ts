import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import ModernError, {
  type ClassOptions,
  type InstanceOptions,
} from 'modern-errors'

const plugin = { name: 'test' as const }
const PluginBaseError = ModernError.subclass('PluginBaseError', {
  plugins: [plugin],
})
const BaseError = ModernError.subclass('BaseError')
const CustomError = ModernError.subclass('CustomError', {
  custom: class extends ModernError {
    one = true
  },
})
const DeepCustomError = CustomError.subclass('DeepCustomError', {
  custom: class extends CustomError {
    two = true
  },
})

expectError(ModernError.subclass('TestError', true))
expectError(PluginBaseError.subclass('TestError', true))
expectError(BaseError.subclass('TestError', true))

expectError(ModernError.subclass('TestError', { other: true }))
expectError(PluginBaseError.subclass('TestError', { other: true }))
expectError(BaseError.subclass('TestError', { other: true }))

expectError(ModernError.subclass('TestError', { custom: true }))
expectError(PluginBaseError.subclass('TestError', { custom: true }))
expectError(BaseError.subclass('TestError', { custom: true }))
expectNotAssignable<ClassOptions>({ custom: true })

expectError(ModernError.subclass('TestError', { custom: class {} }))
expectError(PluginBaseError.subclass('TestError', { custom: class {} }))
expectError(BaseError.subclass('TestError', { custom: class {} }))

expectError(
  ModernError.subclass('TestError', { custom: class extends Object {} }),
)
expectError(
  PluginBaseError.subclass('TestError', { custom: class extends Object {} }),
)
expectError(
  BaseError.subclass('TestError', { custom: class extends Object {} }),
)

expectError(
  ModernError.subclass('TestError', { custom: class extends Error {} }),
)
expectError(
  PluginBaseError.subclass('TestError', { custom: class extends Error {} }),
)
expectError(BaseError.subclass('TestError', { custom: class extends Error {} }))

// `tsd`'s `expectError()` fails at validating the following, so we need to
// use more complex `expectNotAssignable` assertions.
expectNotAssignable<
  NonNullable<NonNullable<Parameters<typeof CustomError.subclass>[1]>['custom']>
>(class extends ModernError {})
expectNotAssignable<
  NonNullable<
    NonNullable<Parameters<typeof DeepCustomError.subclass>[1]>['custom']
  >
>(class extends ModernError {})
expectNotAssignable<
  NonNullable<
    NonNullable<Parameters<typeof DeepCustomError.subclass>[1]>['custom']
  >
>(class extends CustomError {})

expectAssignable<ClassOptions>({ custom: ModernError })
expectNotAssignable<InstanceOptions>({ custom: ModernError })

expectError(ModernError.subclass('TestError', { plugins: true }))
expectNotAssignable<ClassOptions>({ plugins: true })
expectError(ModernError.subclass('TestError', { plugins: [true] }))
expectNotAssignable<ClassOptions>({ plugins: [true] })
expectError(ModernError.subclass('TestError', { plugins: [{}] }))
expectNotAssignable<ClassOptions>({ plugins: [{}] })

expectAssignable<ClassOptions>({ plugins: [plugin] as const })
expectAssignable<ClassOptions<[typeof plugin]>>({ plugins: [plugin] })
expectNotAssignable<InstanceOptions>({ plugins: [plugin] })
