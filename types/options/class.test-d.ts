import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import modernErrors, {
  ClassOptions,
  InstanceOptions,
  GlobalOptions,
} from '../main.js'

const AnyError = modernErrors()
const PluginAnyError = modernErrors([{ name: 'test' as const }])
const ChildError = AnyError.subclass('ChildError', {
  custom: class extends AnyError {
    one = true
  },
})
const DeepChildError = ChildError.subclass('DeepChildError', {
  custom: class extends ChildError {
    two = true
  },
})

expectError(AnyError.subclass('TestError', true))
expectError(PluginAnyError.subclass('TestError', true))
expectError(ChildError.subclass('TestError', true))

expectError(AnyError.subclass('TestError', { other: true }))
expectError(PluginAnyError.subclass('TestError', { other: true }))
expectError(ChildError.subclass('TestError', { other: true }))

expectError(AnyError.subclass('TestError', { custom: true }))
expectError(PluginAnyError.subclass('TestError', { custom: true }))
expectError(ChildError.subclass('TestError', { custom: true }))
expectNotAssignable<ClassOptions>({ custom: true })

expectError(AnyError.subclass('TestError', { custom: class {} }))
expectError(PluginAnyError.subclass('TestError', { custom: class {} }))
expectError(ChildError.subclass('TestError', { custom: class {} }))

expectError(AnyError.subclass('TestError', { custom: class extends Object {} }))
expectError(
  PluginAnyError.subclass('TestError', { custom: class extends Object {} }),
)
expectError(
  ChildError.subclass('TestError', { custom: class extends Object {} }),
)

expectError(AnyError.subclass('TestError', { custom: class extends Error {} }))
expectError(
  PluginAnyError.subclass('TestError', { custom: class extends Error {} }),
)
expectError(
  ChildError.subclass('TestError', { custom: class extends Error {} }),
)

expectError(
  ChildError.subclass('TestError', { custom: class extends AnyError {} }),
)
expectError(
  DeepChildError.subclass('TestError', { custom: class extends AnyError {} }),
)
expectError(
  DeepChildError.subclass('TestError', { custom: class extends ChildError {} }),
)

expectError(
  AnyError.subclass('UnknownError', { custom: class extends AnyError {} }),
)

expectAssignable<ClassOptions>({ custom: AnyError })
expectNotAssignable<InstanceOptions>({ custom: AnyError })
expectNotAssignable<GlobalOptions>({ custom: AnyError })
