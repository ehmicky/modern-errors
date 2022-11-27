import { expectAssignable, expectError } from 'tsd'

import ModernError, { ErrorClass, ErrorInstance } from 'modern-errors'

const ChildError = ModernError.subclass('ChildError')
const DeepChildError = ChildError.subclass('DeepChildError')
const CustomError = ModernError.subclass('CustomError', {
  custom: class extends ModernError {
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

expectAssignable<ErrorClass>(ModernError)
expectAssignable<ErrorClass>(ChildError)
expectAssignable<ErrorClass>(DeepChildError)
expectAssignable<ErrorClass>(CustomError)
expectAssignable<ErrorClass>(ChildCustomError)
expectAssignable<ErrorClass>(CustomChildError)
expectAssignable<ErrorClass>(DeepCustomError)

expectError(ModernError.subclass())
expectError(ModernError.subclass({}))
expectError(ModernError.subclass('Test'))

expectAssignable<ErrorInstance>({} as InstanceType<ErrorClass>)
