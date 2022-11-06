import { expectType, expectError } from 'tsd'

import modernErrors from 'modern-errors'

const BaseError = modernErrors()

const ChildError = BaseError.subclass('ChildError')
const GrandChildError = ChildError.subclass('GrandChildError')
const CustomError = BaseError.subclass('CustomError', {
  custom: class extends BaseError {
    static prop = true as const
  },
})
const ChildCustomError = CustomError.subclass('ChildCustomError')
const DeepCustomError = CustomError.subclass('DeepCustomError', {
  custom: class extends CustomError {
    static deepProp = true as const
  },
})
const CustomChildError = ChildError.subclass('CustomChildError', {
  custom: class extends ChildError {
    static prop = true as const
  },
})

expectType<true>(CustomError.prop)
expectType<true>(ChildCustomError.prop)
expectType<true>(DeepCustomError.prop)
expectType<true>(DeepCustomError.deepProp)
expectType<true>(CustomChildError.prop)

expectError(ChildError.normalize(''))
expectError(GrandChildError.normalize(''))
