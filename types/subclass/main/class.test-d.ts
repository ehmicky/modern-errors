import { expectAssignable, expectError } from 'tsd'

import modernErrors, { ErrorClass, ErrorInstance } from 'modern-errors'

const BaseError = modernErrors()
const ChildError = BaseError.subclass('ChildError')
const DeepChildError = ChildError.subclass('DeepChildError')
const CustomError = BaseError.subclass('CustomError', {
  custom: class extends BaseError {
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

expectAssignable<ErrorClass>(BaseError)
expectAssignable<ErrorClass>(ChildError)
expectAssignable<ErrorClass>(DeepChildError)
expectAssignable<ErrorClass>(CustomError)
expectAssignable<ErrorClass>(ChildCustomError)
expectAssignable<ErrorClass>(CustomChildError)
expectAssignable<ErrorClass>(DeepCustomError)

expectError(BaseError.subclass())
expectError(ChildError.subclass())
expectError(BaseError.subclass({}))
expectError(ChildError.subclass({}))
expectError(BaseError.subclass('Test'))
expectError(ChildError.subclass('Test'))

expectAssignable<ErrorInstance>({} as InstanceType<ErrorClass>)
