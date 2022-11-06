import { expectType } from 'tsd'

import modernErrors from 'modern-errors'

const AnyError = modernErrors()

const CustomError = AnyError.subclass('CustomError', {
  custom: class extends AnyError {
    prop = true as const
  },
})
const ChildCustomError = CustomError.subclass('ChildCustomError')
const DeepCustomError = CustomError.subclass('DeepCustomError', {
  custom: class extends CustomError {
    deepProp = true as const
  },
})
const ChildError = AnyError.subclass('ChildError')
const CustomChildError = ChildError.subclass('CustomChildError', {
  custom: class extends ChildError {
    prop = true as const
  },
})

expectType<true>(new CustomError('').prop)
expectType<true>(new ChildCustomError('').prop)
expectType<true>(new DeepCustomError('').prop)
expectType<true>(new DeepCustomError('').deepProp)
expectType<true>(new CustomChildError('').prop)
