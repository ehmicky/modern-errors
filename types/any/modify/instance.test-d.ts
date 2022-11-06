import { expectType, expectAssignable } from 'tsd'

import modernErrors, { ErrorInstance } from 'modern-errors'

const BaseError = modernErrors()
type BaseInstance = InstanceType<typeof BaseError>

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

const generalError = {} as any as BaseInstance
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

expectType<BaseInstance>(generalError)
expectType<BaseInstance>(childError)
expectType<BaseInstance>(deepChildError)
expectAssignable<BaseInstance>(customError)
expectAssignable<BaseInstance>(childCustomError)
expectAssignable<BaseInstance>(customChildError)
expectAssignable<BaseInstance>(deepCustomError)

expectType<typeof BaseError['prototype']>(generalError)
expectType<typeof ChildError['prototype']>(childError)
expectType<typeof DeepChildError['prototype']>(deepChildError)
expectType<typeof CustomError['prototype']>(customError)
expectType<typeof ChildCustomError['prototype']>(childCustomError)
expectType<typeof CustomChildError['prototype']>(customChildError)
expectType<typeof DeepCustomError['prototype']>(deepCustomError)

expectAssignable<Error>({} as ErrorInstance)
