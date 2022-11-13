import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import ModernError, { ClassOptions, InstanceOptions } from 'modern-errors'

const PluginBaseError = ModernError.subclass('PluginBaseError', {
  plugins: [{ name: 'test' as const }],
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

expectError(
  CustomError.subclass('TestError', { custom: class extends ModernError {} }),
)
expectError(
  DeepCustomError.subclass('TestError', {
    custom: class extends ModernError {},
  }),
)
expectError(
  DeepCustomError.subclass('TestError', {
    custom: class extends CustomError {},
  }),
)

expectAssignable<ClassOptions>({ custom: ModernError })
expectNotAssignable<InstanceOptions>({ custom: ModernError })
