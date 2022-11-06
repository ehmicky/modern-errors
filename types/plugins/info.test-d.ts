import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors, { Info, BaseErrorClass, ErrorInstance } from 'modern-errors'

const instanceMethodsInfo = {} as Info['instanceMethods']
expectError(instanceMethodsInfo.other)
expectAssignable<Error>(instanceMethodsInfo.error)
expectAssignable<boolean>(instanceMethodsInfo.options)
expectAssignable<BaseErrorClass>(instanceMethodsInfo.BaseError)

expectAssignable<object>(instanceMethodsInfo.ErrorClasses)
expectError(instanceMethodsInfo.ErrorClasses.other)
expectType<never>(instanceMethodsInfo.ErrorClasses.BaseError)
expectAssignable<ErrorInstance>(
  new instanceMethodsInfo.ErrorClasses.UnknownError(''),
)
expectAssignable<Function | undefined>(instanceMethodsInfo.ErrorClasses.SError)

const BaseError = modernErrors()
const ChildError = BaseError.subclass('ChildError')
expectAssignable<typeof BaseError>(instanceMethodsInfo.BaseError)
expectAssignable<typeof instanceMethodsInfo.ErrorClasses.TestError>(ChildError)

const staticMethodsInfo = {} as Info['staticMethods']
expectError(staticMethodsInfo.other)
expectError(staticMethodsInfo.error)
expectType<Info['instanceMethods']['options']>(staticMethodsInfo.options)
expectType<Info['instanceMethods']['BaseError']>(staticMethodsInfo.BaseError)
expectType<Info['instanceMethods']['ErrorClasses']>(
  staticMethodsInfo.ErrorClasses,
)
expectType<Info['instanceMethods']['errorInfo']>(staticMethodsInfo.errorInfo)

const propertiesInfo = {} as Info['properties']
expectError(propertiesInfo.other)
expectType<Info['instanceMethods']['error']>(propertiesInfo.error)
expectType<Info['instanceMethods']['options']>(propertiesInfo.options)
expectType<Info['instanceMethods']['BaseError']>(propertiesInfo.BaseError)
expectType<Info['instanceMethods']['ErrorClasses']>(propertiesInfo.ErrorClasses)
expectType<Info['instanceMethods']['errorInfo']>(propertiesInfo.errorInfo)

const errorInfo = instanceMethodsInfo.errorInfo('')
instanceMethodsInfo.errorInfo('')
expectType<Info['errorInfo']>(errorInfo)
expectError(errorInfo.other)
expectType<Info['instanceMethods']['error']>(errorInfo.error)
expectType<Info['instanceMethods']['options']>(errorInfo.options)
expectError(errorInfo.BaseError)
expectError(errorInfo.ErrorClasses)
expectError(errorInfo.errorInfo)
