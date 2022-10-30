import { expectType, expectError } from 'tsd'

import modernErrors from '../main.js'

const AnyError = modernErrors()
const UnknownError = AnyError.subclass('UnknownError')
const SError = AnyError.subclass('SError')

type UnknownInstance = typeof UnknownError['prototype']
type SInstance = typeof SError['prototype']

const unknownErrors = [true] as const
const knownErrors = [new SError('')] as const

expectType<[UnknownInstance]>(
  new AnyError('', { cause: '', errors: unknownErrors }).errors,
)
expectType<[UnknownInstance]>(new SError('', { errors: unknownErrors }).errors)
expectType<[SInstance]>(
  new AnyError('', { cause: '', errors: knownErrors }).errors,
)
expectType<[SInstance]>(new SError('', { errors: knownErrors }).errors)
expectType<[UnknownInstance]>(
  new AnyError('', { cause: new SError('', { errors: unknownErrors }) }).errors,
)
expectType<[UnknownInstance]>(
  new SError('', { cause: new SError('', { errors: unknownErrors }) }).errors,
)
expectType<[UnknownInstance, SInstance]>(
  new AnyError('', {
    cause: new SError('', { errors: unknownErrors }),
    errors: knownErrors,
  }).errors,
)
expectType<[UnknownInstance, SInstance]>(
  new SError('', {
    cause: new SError('', { errors: unknownErrors }),
    errors: knownErrors,
  }).errors,
)

expectError(new AnyError('', { cause: '' }).errors)
expectError(new SError('').errors)
expectError(new AnyError('', { cause: '', errors: true }))
expectError(new SError('', { errors: true }))
