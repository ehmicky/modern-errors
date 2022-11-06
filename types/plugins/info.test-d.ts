import { expectType, expectAssignable, expectError } from 'tsd'

import { Info, BaseErrorClass, ErrorClass } from 'modern-errors'

const instanceMethodsInfo = {} as Info['instanceMethods']
expectError(instanceMethodsInfo.other)
expectAssignable<Error>(instanceMethodsInfo.error)
expectAssignable<boolean>(instanceMethodsInfo.options)
expectAssignable<BaseErrorClass>(instanceMethodsInfo.BaseError)
expectAssignable<readonly ErrorClass[]>(instanceMethodsInfo.ErrorClasses)

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
