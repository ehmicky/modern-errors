import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import modernErrors, {
  ClassOptions,
  InstanceOptions,
  GlobalOptions,
} from '../main.js'

const AnyError = modernErrors()
const PAnyError = modernErrors([{ name: 'test' as const }])
const SError = AnyError.subclass('SError')
const SSError = SError.subclass('SSError')

expectError(AnyError.subclass('TestError', true))
expectError(PAnyError.subclass('TestError', true))
expectError(SError.subclass('TestError', true))

expectError(AnyError.subclass('TestError', { other: true }))
expectError(PAnyError.subclass('TestError', { other: true }))
expectError(SError.subclass('TestError', { other: true }))

expectError(AnyError.subclass('TestError', { custom: true }))
expectError(PAnyError.subclass('TestError', { custom: true }))
expectError(SError.subclass('TestError', { custom: true }))
expectNotAssignable<ClassOptions>({ custom: true })

expectError(AnyError.subclass('TestError', { custom: class {} }))
expectError(PAnyError.subclass('TestError', { custom: class {} }))
expectError(SError.subclass('TestError', { custom: class {} }))

expectError(AnyError.subclass('TestError', { custom: class extends Object {} }))
expectError(
  PAnyError.subclass('TestError', { custom: class extends Object {} }),
)
expectError(SError.subclass('TestError', { custom: class extends Object {} }))

expectError(AnyError.subclass('TestError', { custom: class extends Error {} }))
expectError(PAnyError.subclass('TestError', { custom: class extends Error {} }))
expectError(SError.subclass('TestError', { custom: class extends Error {} }))

expectError(SError.subclass('TestError', { custom: class extends AnyError {} }))
expectError(SError.subclass('TestError', { custom: class extends SSError {} }))
expectError(
  SSError.subclass('TestError', { custom: class extends AnyError {} }),
)
expectError(SSError.subclass('TestError', { custom: class extends SError {} }))

expectError(
  AnyError.subclass('UnknownError', { custom: class extends AnyError {} }),
)

expectAssignable<ClassOptions>({ custom: AnyError })
expectNotAssignable<InstanceOptions>({ custom: AnyError })
expectNotAssignable<GlobalOptions>({ custom: AnyError })
