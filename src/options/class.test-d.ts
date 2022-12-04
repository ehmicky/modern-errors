import ModernError, {
  type ClassOptions,
  type InstanceOptions,
} from 'modern-errors'
import { expectAssignable, expectNotAssignable } from 'tsd'

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

// @ts-expect-error
ModernError.subclass('TestError', true)
// @ts-expect-error
PluginBaseError.subclass('TestError', true)
// @ts-expect-error
BaseError.subclass('TestError', true)

// @ts-expect-error
ModernError.subclass('TestError', { other: true })
// @ts-expect-error
PluginBaseError.subclass('TestError', { other: true })
// @ts-expect-error
BaseError.subclass('TestError', { other: true })

// @ts-expect-error
ModernError.subclass('TestError', { custom: true })
// @ts-expect-error
PluginBaseError.subclass('TestError', { custom: true })
// @ts-expect-error
BaseError.subclass('TestError', { custom: true })
expectNotAssignable<ClassOptions>({ custom: true })

// @ts-expect-error
ModernError.subclass('TestError', { custom: class {} })
// @ts-expect-error
PluginBaseError.subclass('TestError', { custom: class {} })
// @ts-expect-error
BaseError.subclass('TestError', { custom: class {} })

// @ts-expect-error
ModernError.subclass('TestError', { custom: class extends Object {} })
// @ts-expect-error
PluginBaseError.subclass('TestError', { custom: class extends Object {} })
// @ts-expect-error
BaseError.subclass('TestError', { custom: class extends Object {} })

// @ts-expect-error
ModernError.subclass('TestError', { custom: class extends Error {} })
// @ts-expect-error
PluginBaseError.subclass('TestError', { custom: class extends Error {} })
// @ts-expect-error
BaseError.subclass('TestError', { custom: class extends Error {} })

// @ts-expect-error
CustomError.subclass('TestError', { custom: class extends ModernError {} })
// @ts-expect-error
DeepCustomError.subclass('TestError', { custom: class extends ModernError {} })
// @ts-expect-error
DeepCustomError.subclass('TestError', { custom: class extends CustomError {} })

expectAssignable<ClassOptions>({ custom: ModernError })
expectNotAssignable<InstanceOptions>({ custom: ModernError })

// @ts-expect-error
ModernError.subclass('TestError', { plugins: true })
expectNotAssignable<ClassOptions>({ plugins: true })
// @ts-expect-error
ModernError.subclass('TestError', { plugins: [true] })
expectNotAssignable<ClassOptions>({ plugins: [true] })
// @ts-expect-error
ModernError.subclass('TestError', { plugins: [{}] })
expectNotAssignable<ClassOptions>({ plugins: [{}] })

expectAssignable<ClassOptions>({ plugins: [plugin] as const })
expectAssignable<ClassOptions<[typeof plugin]>>({ plugins: [plugin] })
expectNotAssignable<InstanceOptions>({ plugins: [plugin] })
