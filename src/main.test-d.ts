import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors from './main.js'

const AnyError = modernErrors()
type AnyErrorInstance = InstanceType<typeof AnyError>

expectError(modernErrors(true))

const SimpleError = AnyError.subclass('SimpleError')
type SimpleErrorInstance = InstanceType<typeof SimpleError>

class BaseTestError extends AnyError {
  constructor(message: string | boolean, options?: object) {
    super(String(message), options)
  }
  prop = true as const
  static staticProp = true as const
}
const TestError = AnyError.subclass('TestError', { custom: BaseTestError })
type TestErrorInstance = InstanceType<typeof TestError>

expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor(message: boolean, options?: object) {
        super(String(message), options)
      }
    },
  }),
)

AnyError.subclass('TestError', { custom: AnyError })
expectError(AnyError.subclass('Test'))
expectError(AnyError.subclass({}))
expectError(AnyError.subclass())

const testError = new TestError(true)
expectType<TestErrorInstance>(testError)
expectAssignable<BaseTestError>(testError)
expectAssignable<AnyErrorInstance>(testError)
expectAssignable<Error>(testError)
expectType<true>(TestError.staticProp)
expectType<'TestError'>(testError.name)
expectType<true>(testError.prop)

const simpleError = new SimpleError('')
expectType<SimpleErrorInstance>(simpleError)
expectAssignable<AnyErrorInstance>(simpleError)
expectAssignable<Error>(simpleError)
expectError(SimpleError.staticProp)
expectType<'SimpleError'>(simpleError.name)
expectError(simpleError.prop)

const anyError = new AnyError('')
expectType<AnyErrorInstance>(anyError)
expectAssignable<Error>(anyError)
expectError(AnyError.staticProp)
expectError(anyError.prop)

expectType<AnyErrorInstance>(AnyError.normalize(''))
expectError(TestError.normalize(''))
expectError(SimpleError.normalize(''))
expectError(AnyError.normalize('', true))

const error = new Error('')

if (error instanceof AnyError) {
  expectType<AnyErrorInstance>(error)
}

// Type narrowing with `instanceof` of error classes with a `custom` option
// does not work due to:
// https://github.com/microsoft/TypeScript/issues/50844
// if (anyError instanceof TestError) {
//   expectType<TestErrorInstance>(anyError)
// }

if (anyError instanceof SimpleError) {
  expectType<SimpleErrorInstance>(anyError)
}

if (testError instanceof SimpleError) {
  expectType<never>(testError)
}
if (testError instanceof TestError) {
  expectType<TestErrorInstance>(testError)
}
if (testError instanceof AnyError) {
  expectType<TestErrorInstance>(testError)
}
if (testError instanceof Error) {
  expectType<TestErrorInstance>(testError)
}
