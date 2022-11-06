import { expectType, expectError } from 'tsd'

import modernErrors from 'modern-errors'

const AnyError = modernErrors()
const UnknownError = AnyError.subclass('UnknownError')
const ChildError = AnyError.subclass('ChildError')

type UnknownInstance = typeof UnknownError['prototype']
type ChildInstance = typeof ChildError['prototype']

const unknownErrorsArray = [true] as readonly true[]
const unknownErrors = [true] as readonly [true]
const knownErrors = [new ChildError('')] as const

expectType<UnknownInstance[]>(
  new AnyError('', { cause: '', errors: unknownErrorsArray }).errors,
)
expectType<UnknownInstance[]>(
  new ChildError('', { errors: unknownErrorsArray }).errors,
)
expectType<[UnknownInstance]>(
  new AnyError('', { cause: '', errors: unknownErrors }).errors,
)
expectType<[UnknownInstance]>(
  new ChildError('', { errors: unknownErrors }).errors,
)
expectType<[ChildInstance]>(
  new AnyError('', { cause: '', errors: knownErrors }).errors,
)
expectType<[ChildInstance]>(new ChildError('', { errors: knownErrors }).errors)
expectType<UnknownInstance[]>(
  new AnyError('', {
    cause: new ChildError('', { errors: unknownErrorsArray }),
  }).errors,
)
expectType<UnknownInstance[]>(
  new ChildError('', {
    cause: new ChildError('', { errors: unknownErrorsArray }),
  }).errors,
)
expectType<[UnknownInstance]>(
  new AnyError('', { cause: new ChildError('', { errors: unknownErrors }) })
    .errors,
)
expectType<[UnknownInstance]>(
  new ChildError('', { cause: new ChildError('', { errors: unknownErrors }) })
    .errors,
)
expectType<[UnknownInstance, ChildInstance]>(
  new AnyError('', {
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

expectError(new AnyError('', { cause: '' }).errors)
expectError(new ChildError('').errors)
expectError(new AnyError('', { cause: '', errors: true }))
expectError(new ChildError('', { errors: true }))
