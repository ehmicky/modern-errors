import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import modernErrors, {
  ClassOptions,
  InstanceOptions,
  GlobalOptions,
} from 'modern-errors'

const BaseError = modernErrors()
const PluginBaseError = modernErrors([{ name: 'test' as const }])
const ChildError = BaseError.subclass('ChildError')
const CustomError = BaseError.subclass('CustomError', {
  custom: class extends BaseError {
    one = true
  },
})
const DeepCustomError = CustomError.subclass('DeepCustomError', {
  custom: class extends CustomError {
    two = true
  },
})

expectError(BaseError.subclass('TestError', true))
expectError(PluginBaseError.subclass('TestError', true))
expectError(ChildError.subclass('TestError', true))

expectError(BaseError.subclass('TestError', { other: true }))
expectError(PluginBaseError.subclass('TestError', { other: true }))
expectError(ChildError.subclass('TestError', { other: true }))

expectError(BaseError.subclass('TestError', { custom: true }))
expectError(PluginBaseError.subclass('TestError', { custom: true }))
expectError(ChildError.subclass('TestError', { custom: true }))
expectNotAssignable<ClassOptions>({ custom: true })

expectError(BaseError.subclass('TestError', { custom: class {} }))
expectError(PluginBaseError.subclass('TestError', { custom: class {} }))
expectError(ChildError.subclass('TestError', { custom: class {} }))

expectError(BaseError.subclass('TestError', { custom: class extends Object {} }))
expectError(
  PluginBaseError.subclass('TestError', { custom: class extends Object {} }),
)
expectError(
  ChildError.subclass('TestError', { custom: class extends Object {} }),
)

expectError(BaseError.subclass('TestError', { custom: class extends Error {} }))
expectError(
  PluginBaseError.subclass('TestError', { custom: class extends Error {} }),
)
expectError(
  ChildError.subclass('TestError', { custom: class extends Error {} }),
)

expectError(
  CustomError.subclass('TestError', { custom: class extends BaseError {} }),
)
expectError(
  DeepCustomError.subclass('TestError', { custom: class extends BaseError {} }),
)
expectError(
  DeepCustomError.subclass('TestError', {
    custom: class extends CustomError {},
  }),
)

expectError(
  BaseError.subclass('UnknownError', { custom: class extends BaseError {} }),
)

expectAssignable<ClassOptions>({ custom: BaseError })
expectNotAssignable<InstanceOptions>({ custom: BaseError })
expectNotAssignable<GlobalOptions>({ custom: BaseError })
