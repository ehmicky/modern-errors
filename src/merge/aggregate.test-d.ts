import { expectType } from 'tsd'

import ModernError from 'modern-errors'

const CustomError = ModernError.subclass('CustomError', {
  custom: class extends ModernError {
    prop = true
  },
})
type CustomInstance = typeof CustomError['prototype']

const unknownErrorsArray = [true] as readonly true[]
const unknownErrors = [true] as readonly [true]
const knownErrors = [new CustomError('')] as const

expectType<Error[]>(new ModernError('', { errors: unknownErrorsArray }).errors)
expectType<Error[]>(new CustomError('', { errors: unknownErrorsArray }).errors)
expectType<[Error]>(new ModernError('', { errors: unknownErrors }).errors)
expectType<[Error]>(new CustomError('', { errors: unknownErrors }).errors)
expectType<[CustomInstance]>(
  new ModernError('', { errors: knownErrors }).errors,
)
expectType<[CustomInstance]>(
  new CustomError('', { errors: knownErrors }).errors,
)
expectType<Error[]>(
  new ModernError('', {
    cause: new CustomError('', { errors: unknownErrorsArray }),
  }).errors,
)
expectType<Error[]>(
  new CustomError('', {
    cause: new CustomError('', { errors: unknownErrorsArray }),
  }).errors,
)
expectType<[Error]>(
  new ModernError('', { cause: new CustomError('', { errors: unknownErrors }) })
    .errors,
)
expectType<[Error]>(
  new CustomError('', { cause: new CustomError('', { errors: unknownErrors }) })
    .errors,
)
expectType<[Error, CustomInstance]>(
  new ModernError('', {
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

// @ts-expect-error
new ModernError('').errors
// @ts-expect-error
new CustomError('').errors
// @ts-expect-error
new ModernError('', { errors: true })
// @ts-expect-error
new CustomError('', { errors: true })
