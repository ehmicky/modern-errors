import { expectType } from 'tsd'

import ModernError from 'modern-errors'

const BaseError = ModernError.subclass('BaseError')
const CustomError = ModernError.subclass('CustomError', {
  custom: class extends ModernError {
    static prop = true as const
  },
})
const ChildCustomError = CustomError.subclass('ChildCustomError')
const DeepCustomError = CustomError.subclass('DeepCustomError', {
  custom: class extends CustomError {
    static deepProp = true as const
  },
})
const CustomBaseError = BaseError.subclass('CustomBaseError', {
  custom: class extends BaseError {
    static prop = true as const
  },
})

expectType<true>(CustomError.prop)
expectType<true>(ChildCustomError.prop)
expectType<true>(DeepCustomError.prop)
expectType<true>(DeepCustomError.deepProp)
expectType<true>(CustomBaseError.prop)
