import { expectType, expectAssignable } from 'tsd'

import modernErrors, { ErrorInstance } from '../../main.js'

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>

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

const generalError = {} as any as AnyInstance
const childError = new ChildError('')
const deepChildError = new DeepChildError('')
const customError = new CustomError('')
const childCustomError = new ChildCustomError('')
const customChildError = new CustomChildError('')
const deepCustomError = new DeepCustomError('')

expectType<Error>(generalError)
expectType<Error>(childError)
expectType<Error>(deepChildError)
expectAssignable<Error>(customError)
expectAssignable<Error>(childCustomError)
expectAssignable<Error>(customChildError)
expectAssignable<Error>(deepCustomError)

expectAssignable<ErrorInstance>(generalError)
expectAssignable<ErrorInstance>(childError)
expectAssignable<ErrorInstance>(deepChildError)
expectAssignable<ErrorInstance>(customError)
expectAssignable<ErrorInstance>(childCustomError)
expectAssignable<ErrorInstance>(customChildError)
expectAssignable<ErrorInstance>(deepCustomError)

expectType<AnyInstance>(generalError)
expectType<AnyInstance>(childError)
expectType<AnyInstance>(deepChildError)
expectAssignable<AnyInstance>(customError)
expectAssignable<AnyInstance>(childCustomError)
expectAssignable<AnyInstance>(customChildError)
expectAssignable<AnyInstance>(deepCustomError)

expectType<typeof AnyError['prototype']>(generalError)
expectType<typeof ChildError['prototype']>(childError)
expectType<typeof DeepChildError['prototype']>(deepChildError)
expectType<typeof CustomError['prototype']>(customError)
expectType<typeof ChildCustomError['prototype']>(childCustomError)
expectType<typeof CustomChildError['prototype']>(customChildError)
expectType<typeof DeepCustomError['prototype']>(deepCustomError)

expectAssignable<Error>({} as ErrorInstance)
