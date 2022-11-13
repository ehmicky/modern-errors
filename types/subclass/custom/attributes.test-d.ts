import { expectType } from 'tsd'

import ModernError from 'modern-errors'

const CustomError = ModernError.subclass('CustomError', {
  custom: class extends ModernError {
    prop = true as const
  },
})
const ChildCustomError = CustomError.subclass('ChildCustomError')
const DeepCustomError = CustomError.subclass('DeepCustomError', {
  custom: class extends CustomError {
    deepProp = true as const
  },
})
const BaseError = ModernError.subclass('BaseError')
const CustomBaseError = BaseError.subclass('CustomBaseError', {
  custom: class extends BaseError {
    prop = true as const
  },
})

expectType<true>(new CustomError('').prop)
expectType<true>(new ChildCustomError('').prop)
expectType<true>(new DeepCustomError('').prop)
expectType<true>(new DeepCustomError('').deepProp)
expectType<true>(new CustomBaseError('').prop)
