import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors, { Info, AnyErrorClass, ErrorInstance } from '../main.js'

const imInfo = {} as Info['instanceMethods']
expectError(imInfo.other)
expectType<Error>(imInfo.error)
expectAssignable<boolean>(imInfo.options)
expectType<boolean>(imInfo.showStack)
expectAssignable<AnyErrorClass>(imInfo.AnyError)

expectAssignable<object>(imInfo.ErrorClasses)
expectError(imInfo.ErrorClasses.other)
expectType<never>(imInfo.ErrorClasses.AnyError)
expectType<ErrorInstance>(new imInfo.ErrorClasses.UnknownError(''))
expectAssignable<Function | undefined>(imInfo.ErrorClasses.SError)

const AnyError = modernErrors()
const SError = AnyError.subclass('SError')
expectAssignable<typeof AnyError>(imInfo.AnyError)
expectAssignable<typeof imInfo.ErrorClasses.TestError>(SError)

const smInfo = {} as Info['staticMethods']
expectError(smInfo.other)
expectError(smInfo.error)
expectType<Info['instanceMethods']['options']>(smInfo.options)
expectError(smInfo.showStack)
expectType<Info['instanceMethods']['AnyError']>(smInfo.AnyError)
expectType<Info['instanceMethods']['ErrorClasses']>(smInfo.ErrorClasses)
expectType<Info['instanceMethods']['errorInfo']>(smInfo.errorInfo)

const pInfo = {} as Info['properties']
expectError(pInfo.other)
expectType<Info['instanceMethods']['error']>(pInfo.error)
expectType<Info['instanceMethods']['options']>(pInfo.options)
expectType<Info['instanceMethods']['showStack']>(pInfo.showStack)
expectType<Info['instanceMethods']['AnyError']>(pInfo.AnyError)
expectType<Info['instanceMethods']['ErrorClasses']>(pInfo.ErrorClasses)
expectType<Info['instanceMethods']['errorInfo']>(pInfo.errorInfo)

const eInfo = imInfo.errorInfo('')
imInfo.errorInfo('')
expectType<Info['errorInfo']>(eInfo)
expectError(eInfo.other)
expectType<Info['instanceMethods']['error']>(eInfo.error)
expectType<Info['instanceMethods']['options']>(eInfo.options)
expectType<Info['instanceMethods']['showStack']>(eInfo.showStack)
expectError(eInfo.AnyError)
expectError(eInfo.ErrorClasses)
expectError(eInfo.errorInfo)
