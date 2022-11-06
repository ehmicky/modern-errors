import { expectType, expectError } from 'tsd'

import modernErrors from 'modern-errors'

const BaseError = modernErrors()
const CustomError = BaseError.subclass('CustomError', {
  custom: class extends BaseError {
    prop = true
  },
})
type CustomInstance = typeof CustomError['prototype']

const unknownErrorsArray = [true] as readonly true[]
const unknownErrors = [true] as readonly [true]
const knownErrors = [new CustomError('')] as const

expectType<Error[]>(
  new BaseError('', { cause: '', errors: unknownErrorsArray }).errors,
)
expectType<Error[]>(new CustomError('', { errors: unknownErrorsArray }).errors)
expectType<[Error]>(
  new BaseError('', { cause: '', errors: unknownErrors }).errors,
)
expectType<[Error]>(new CustomError('', { errors: unknownErrors }).errors)
expectType<[CustomInstance]>(
  new BaseError('', { cause: '', errors: knownErrors }).errors,
)
expectType<[CustomInstance]>(
  new CustomError('', { errors: knownErrors }).errors,
)
expectType<Error[]>(
  new BaseError('', {
    cause: new CustomError('', { errors: unknownErrorsArray }),
  }).errors,
)
expectType<Error[]>(
  new CustomError('', {
    cause: new CustomError('', { errors: unknownErrorsArray }),
  }).errors,
)
expectType<[Error]>(
  new BaseError('', { cause: new CustomError('', { errors: unknownErrors }) })
    .errors,
)
expectType<[Error]>(
  new CustomError('', { cause: new CustomError('', { errors: unknownErrors }) })
    .errors,
)
expectType<[Error, CustomInstance]>(
  new BaseError('', {
    cause: new CustomError('', { errors: unknownErrors }),
    errors: knownErrors,
  }).errors,
)
expectType<[Error, CustomInstance]>(
  new CustomError('', {
    cause: new CustomError('', { errors: unknownErrors }),
    errors: knownErrors,
  }).errors,
)

expectError(new BaseError('', { cause: '' }).errors)
expectError(new CustomError('').errors)
expectError(new BaseError('', { cause: '', errors: true }))
expectError(new CustomError('', { errors: true }))
