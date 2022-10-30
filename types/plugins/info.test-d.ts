import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors, { Info, AnyErrorClass, ErrorInstance } from '../main.js'

const instanceMethodsInfo = {} as Info['instanceMethods']
expectError(instanceMethodsInfo.other)
expectAssignable<Error>(instanceMethodsInfo.error)
expectAssignable<boolean>(instanceMethodsInfo.options)
expectType<boolean>(instanceMethodsInfo.showStack)
expectAssignable<AnyErrorClass>(instanceMethodsInfo.AnyError)

expectAssignable<object>(instanceMethodsInfo.ErrorClasses)
expectError(instanceMethodsInfo.ErrorClasses.other)
expectType<never>(instanceMethodsInfo.ErrorClasses.AnyError)
expectAssignable<ErrorInstance>(
  new instanceMethodsInfo.ErrorClasses.UnknownError(''),
)
expectAssignable<Function | undefined>(instanceMethodsInfo.ErrorClasses.SError)

const AnyError = modernErrors()
const ChildError = AnyError.subclass('ChildError')
expectAssignable<typeof AnyError>(instanceMethodsInfo.AnyError)
expectAssignable<typeof instanceMethodsInfo.ErrorClasses.TestError>(ChildError)

const staticMethodsInfo = {} as Info['staticMethods']
expectError(staticMethodsInfo.other)
expectError(staticMethodsInfo.error)
expectType<Info['instanceMethods']['options']>(staticMethodsInfo.options)
expectError(staticMethodsInfo.showStack)
expectType<Info['instanceMethods']['AnyError']>(staticMethodsInfo.AnyError)
expectType<Info['instanceMethods']['ErrorClasses']>(
  staticMethodsInfo.ErrorClasses,
)
expectType<Info['instanceMethods']['errorInfo']>(staticMethodsInfo.errorInfo)

const propertiesInfo = {} as Info['properties']
expectError(propertiesInfo.other)
expectType<Info['instanceMethods']['error']>(propertiesInfo.error)
expectType<Info['instanceMethods']['options']>(propertiesInfo.options)
expectType<Info['instanceMethods']['showStack']>(propertiesInfo.showStack)
expectType<Info['instanceMethods']['AnyError']>(propertiesInfo.AnyError)
expectType<Info['instanceMethods']['ErrorClasses']>(propertiesInfo.ErrorClasses)
expectType<Info['instanceMethods']['errorInfo']>(propertiesInfo.errorInfo)

const errorInfo = instanceMethodsInfo.errorInfo('')
instanceMethodsInfo.errorInfo('')
expectType<Info['errorInfo']>(errorInfo)
expectError(errorInfo.other)
expectType<Info['instanceMethods']['error']>(errorInfo.error)
expectType<Info['instanceMethods']['options']>(errorInfo.options)
expectType<Info['instanceMethods']['showStack']>(errorInfo.showStack)
expectError(errorInfo.AnyError)
expectError(errorInfo.ErrorClasses)
expectError(errorInfo.errorInfo)
