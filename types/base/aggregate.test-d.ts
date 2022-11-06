import { expectType, expectError } from 'tsd'

import modernErrors from 'modern-errors'

const BaseError = modernErrors()
const UnknownError = BaseError.subclass('UnknownError')
const ChildError = BaseError.subclass('ChildError')

type UnknownInstance = typeof UnknownError['prototype']
type ChildInstance = typeof ChildError['prototype']

const unknownErrorsArray = [true] as readonly true[]
const unknownErrors = [true] as readonly [true]
const knownErrors = [new ChildError('')] as const

expectType<UnknownInstance[]>(
  new BaseError('', { cause: '', errors: unknownErrorsArray }).errors,
)
expectType<UnknownInstance[]>(
  new ChildError('', { errors: unknownErrorsArray }).errors,
)
expectType<[UnknownInstance]>(
  new BaseError('', { cause: '', errors: unknownErrors }).errors,
)
expectType<[UnknownInstance]>(
  new ChildError('', { errors: unknownErrors }).errors,
)
expectType<[ChildInstance]>(
  new BaseError('', { cause: '', errors: knownErrors }).errors,
)
expectType<[ChildInstance]>(new ChildError('', { errors: knownErrors }).errors)
expectType<UnknownInstance[]>(
  new BaseError('', {
    cause: new ChildError('', { errors: unknownErrorsArray }),
  }).errors,
)
expectType<UnknownInstance[]>(
  new ChildError('', {
    cause: new ChildError('', { errors: unknownErrorsArray }),
  }).errors,
)
expectType<[UnknownInstance]>(
  new BaseError('', { cause: new ChildError('', { errors: unknownErrors }) })
    .errors,
)
expectType<[UnknownInstance]>(
  new ChildError('', { cause: new ChildError('', { errors: unknownErrors }) })
    .errors,
)
expectType<[UnknownInstance, ChildInstance]>(
  new BaseError('', {
    cause: new ChildError('', { errors: unknownErrors }),
    errors: knownErrors,
  }).errors,
)
expectType<[UnknownInstance, ChildInstance]>(
  new ChildError('', {
    cause: new ChildError('', { errors: unknownErrors }),
    errors: knownErrors,
  }).errors,
)

expectError(new BaseError('', { cause: '' }).errors)
expectError(new ChildError('').errors)
expectError(new BaseError('', { cause: '', errors: true }))
expectError(new ChildError('', { errors: true }))
