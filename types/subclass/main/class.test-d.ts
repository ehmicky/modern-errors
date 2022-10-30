import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import modernErrors, {
  AnyErrorClass,
  ErrorClass,
  ErrorInstance,
} from '../../main.js'

const AnyError = modernErrors()
const ChildError = AnyError.subclass('ChildError')
const DeepChildError = ChildError.subclass('DeepChildError')
const CustomError = AnyError.subclass('CustomError', {
  custom: class extends AnyError {
    prop = true
  },
})
const ChildCustomError = CustomError.subclass('ChildCustomError')
const CustomChildError = ChildError.subclass('CustomChildError', {
  custom: class extends ChildError {
    prop = true
  },
})
const DeepCustomError = CustomError.subclass('DeepCustomError', {
  custom: class extends CustomError {
    propTwo = true
  },
})

expectAssignable<ErrorClass>(AnyError)
expectAssignable<ErrorClass>(ChildError)
expectAssignable<ErrorClass>(DeepChildError)
expectAssignable<ErrorClass>(CustomError)
expectAssignable<ErrorClass>(ChildCustomError)
expectAssignable<ErrorClass>(CustomChildError)
expectAssignable<ErrorClass>(DeepCustomError)

expectAssignable<AnyErrorClass>(AnyError)
expectNotAssignable<AnyErrorClass>(ChildError)
expectNotAssignable<AnyErrorClass>(DeepChildError)
expectNotAssignable<AnyErrorClass>(CustomError)
expectNotAssignable<AnyErrorClass>(ChildCustomError)
expectNotAssignable<AnyErrorClass>(CustomChildError)
expectNotAssignable<AnyErrorClass>(DeepCustomError)

expectError(AnyError.subclass())
expectError(ChildError.subclass())
expectError(AnyError.subclass({}))
expectError(ChildError.subclass({}))
expectError(AnyError.subclass('Test'))
expectError(ChildError.subclass('Test'))

expectAssignable<ErrorInstance>({} as InstanceType<ErrorClass>)
