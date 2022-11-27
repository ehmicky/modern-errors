import { expectType, expectAssignable, expectError } from 'tsd'

import type { Info, ErrorClass } from 'modern-errors'

const instanceMethodsInfo = {} as Info['instanceMethods']
expectError(instanceMethodsInfo.other)
expectAssignable<Error>(instanceMethodsInfo.error)
expectAssignable<boolean>(instanceMethodsInfo.options)
expectAssignable<ErrorClass>(instanceMethodsInfo.ErrorClass)
expectAssignable<readonly ErrorClass[]>(instanceMethodsInfo.ErrorClasses)

const staticMethodsInfo = {} as Info['staticMethods']
expectError(staticMethodsInfo.other)
expectError(staticMethodsInfo.error)
expectType<Info['instanceMethods']['options']>(staticMethodsInfo.options)
expectType<Info['instanceMethods']['ErrorClass']>(staticMethodsInfo.ErrorClass)
expectType<Info['instanceMethods']['ErrorClasses']>(
  staticMethodsInfo.ErrorClasses,
)
expectType<Info['instanceMethods']['errorInfo']>(staticMethodsInfo.errorInfo)

const propertiesInfo = {} as Info['properties']
expectError(propertiesInfo.other)
expectType<Info['instanceMethods']['error']>(propertiesInfo.error)
expectType<Info['instanceMethods']['options']>(propertiesInfo.options)
expectType<Info['instanceMethods']['ErrorClass']>(propertiesInfo.ErrorClass)
expectType<Info['instanceMethods']['ErrorClasses']>(propertiesInfo.ErrorClasses)
expectType<Info['instanceMethods']['errorInfo']>(propertiesInfo.errorInfo)

const errorInfo = instanceMethodsInfo.errorInfo('')
instanceMethodsInfo.errorInfo('')
expectType<Info['errorInfo']>(errorInfo)
expectError(errorInfo.other)
expectType<Info['instanceMethods']['error']>(errorInfo.error)
expectType<Info['instanceMethods']['options']>(errorInfo.options)
expectType<Info['instanceMethods']['ErrorClass']>(errorInfo.ErrorClass)
expectType<Info['instanceMethods']['ErrorClasses']>(errorInfo.ErrorClasses)
expectError(errorInfo.errorInfo)
