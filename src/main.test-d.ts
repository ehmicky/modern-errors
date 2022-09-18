import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors from './main.js'

const AnyError = modernErrors()
type AnyErrorInstance = InstanceType<typeof AnyError>

expectError(modernErrors(true))

const SimpleError = AnyError.subclass('SimpleError')
type SimpleErrorInstance = InstanceType<typeof SimpleError>

const DeepSimpleError = SimpleError.subclass('DeepSimpleError')
type DeepSimpleErrorInstance = InstanceType<typeof DeepSimpleError>

class BaseShallowCustomError extends AnyError {
  constructor(message: string | boolean, options?: object) {
    super(String(message), options)
  }
  prop = true as const
  static staticProp = true as const
}
const ShallowCustomError = AnyError.subclass('ShallowCustomError', {
  custom: BaseShallowCustomError,
})
type ShallowCustomErrorInstance = InstanceType<typeof ShallowCustomError>

const DeepSimpleCustomError = ShallowCustomError.subclass(
  'DeepSimpleCustomError',
)
type DeepSimpleCustomErrorInstance = InstanceType<typeof DeepSimpleCustomError>

class BaseDeepCustomError extends ShallowCustomError {
  constructor(message: string | boolean | number, options?: object) {
    super(String(message), options)
  }
  deepProp = true as const
  static deepStaticProp = true as const
}
const DeepCustomError = ShallowCustomError.subclass('DeepCustomError', {
  custom: BaseDeepCustomError,
})
type DeepCustomErrorInstance = InstanceType<typeof DeepCustomError>

expectError(AnyError.subclass())
expectError(AnyError.subclass({}))
expectError(AnyError.subclass('Test'))
expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor(message: boolean, options?: object) {
        super(String(message), options)
      }
    },
  }),
)

const simpleError = new SimpleError('')
expectType<SimpleErrorInstance>(simpleError)
expectAssignable<AnyErrorInstance>(simpleError)
expectAssignable<Error>(simpleError)
expectError(SimpleError.staticProp)
expectType<'SimpleError'>(simpleError.name)
expectError(simpleError.prop)

const deepSimpleError = new DeepSimpleError('')
expectType<DeepSimpleErrorInstance>(deepSimpleError)
expectAssignable<AnyErrorInstance>(deepSimpleError)
expectAssignable<Error>(deepSimpleError)
expectError(DeepSimpleError.staticProp)
expectType<'DeepSimpleError'>(deepSimpleError.name)
expectError(deepSimpleError.prop)

const shallowCustomError = new ShallowCustomError(true)
expectType<ShallowCustomErrorInstance>(shallowCustomError)
expectAssignable<BaseShallowCustomError>(shallowCustomError)
expectAssignable<AnyErrorInstance>(shallowCustomError)
expectAssignable<Error>(shallowCustomError)
expectType<true>(ShallowCustomError.staticProp)
expectType<'ShallowCustomError'>(shallowCustomError.name)
expectType<true>(shallowCustomError.prop)

const deepSimpleCustomError = new DeepSimpleCustomError(true)
expectType<DeepSimpleCustomErrorInstance>(deepSimpleCustomError)
expectAssignable<BaseShallowCustomError>(deepSimpleCustomError)
expectAssignable<AnyErrorInstance>(deepSimpleCustomError)
expectAssignable<Error>(deepSimpleCustomError)
expectType<true>(DeepSimpleCustomError.staticProp)
expectType<'DeepSimpleCustomError'>(deepSimpleCustomError.name)
expectType<true>(deepSimpleCustomError.prop)

const deepCustomError = new DeepCustomError(0)
expectType<DeepCustomErrorInstance>(deepCustomError)
expectAssignable<BaseShallowCustomError>(deepCustomError)
expectAssignable<AnyErrorInstance>(deepCustomError)
expectAssignable<Error>(deepCustomError)
expectType<true>(DeepCustomError.staticProp)
expectType<true>(DeepCustomError.deepStaticProp)
expectType<'DeepCustomError'>(deepCustomError.name)
expectType<true>(deepCustomError.prop)
expectType<true>(deepCustomError.deepProp)

const anyError = new AnyError('')
expectType<AnyErrorInstance>(anyError)
expectAssignable<Error>(anyError)
expectError(AnyError.staticProp)
expectError(anyError.prop)

expectType<AnyErrorInstance>(AnyError.normalize(''))
expectError(SimpleError.normalize(''))
expectError(DeepSimpleError.normalize(''))
expectError(ShallowCustomError.normalize(''))
expectError(DeepSimpleCustomError.normalize(''))
expectError(DeepCustomError.normalize(''))
expectError(AnyError.normalize('', true))

const error = new Error('')

if (error instanceof AnyError) {
  expectType<AnyErrorInstance>(error)
}

// Type narrowing with `instanceof` of error classes with a `custom` option
// does not work due to:
// https://github.com/microsoft/TypeScript/issues/50844
// if (anyError instanceof ShallowCustomError) {
//   expectType<ShallowCustomErrorInstance>(anyError)
// }
// if (anyError instanceof DeepSimpleCustomError) {
//   expectType<DeepSimpleCustomErrorInstance>(anyError)
// }
// if (anyError instanceof DeepCustomError) {
//   expectType<DeepCustomErrorInstance>(anyError)
// }

if (anyError instanceof SimpleError) {
  expectType<SimpleErrorInstance>(anyError)
}
if (anyError instanceof DeepSimpleError) {
  expectType<DeepSimpleErrorInstance>(anyError)
}

if (shallowCustomError instanceof SimpleError) {
  expectType<never>(shallowCustomError)
}
if (shallowCustomError instanceof ShallowCustomError) {
  expectType<ShallowCustomErrorInstance>(shallowCustomError)
}
if (shallowCustomError instanceof AnyError) {
  expectType<ShallowCustomErrorInstance>(shallowCustomError)
}
if (shallowCustomError instanceof Error) {
  expectType<ShallowCustomErrorInstance>(shallowCustomError)
}
