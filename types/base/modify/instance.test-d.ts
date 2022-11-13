import { expectType, expectAssignable } from 'tsd'

import ModernError, { ErrorInstance } from 'modern-errors'

type ModernErrorInstance = InstanceType<typeof ModernError>

const BaseError = ModernError.subclass('BaseError')
const ChildError = BaseError.subclass('ChildError')
const CustomError = ModernError.subclass('CustomError', {
  custom: class extends ModernError {
    prop = true
  },
})
const ChildCustomError = CustomError.subclass('ChildCustomError')
const CustomChildError = BaseError.subclass('CustomChildError', {
  custom: class extends BaseError {
    prop = true
  },
})
const DeepCustomError = CustomError.subclass('DeepCustomError', {
  custom: class extends CustomError {
    propTwo = true
  },
})

const generalError = {} as any as ModernErrorInstance
const childError = new BaseError('')
const deepChildError = new ChildError('')
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

expectType<ModernErrorInstance>(generalError)
expectType<ModernErrorInstance>(childError)
expectType<ModernErrorInstance>(deepChildError)
expectAssignable<ModernErrorInstance>(customError)
expectAssignable<ModernErrorInstance>(childCustomError)
expectAssignable<ModernErrorInstance>(customChildError)
expectAssignable<ModernErrorInstance>(deepCustomError)

expectType<typeof ModernError['prototype']>(generalError)
expectType<typeof BaseError['prototype']>(childError)
expectType<typeof ChildError['prototype']>(deepChildError)
expectType<typeof CustomError['prototype']>(customError)
expectType<typeof ChildCustomError['prototype']>(childCustomError)
expectType<typeof CustomChildError['prototype']>(customChildError)
expectType<typeof DeepCustomError['prototype']>(deepCustomError)

expectAssignable<Error>({} as ErrorInstance)
