import { expectError } from 'tsd'

import ModernError, { InstanceOptions } from 'modern-errors'

const BaseError = ModernError.subclass('BaseError')
const DeepBaseError = BaseError.subclass('DeepBaseError')
const CustomError = ModernError.subclass('CustomError', {
  custom: class extends ModernError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: true },
      extra?: true,
    ) {
      super(message, options)
    }
  },
})
const ChildCustomError = CustomError.subclass('ChildCustomError')
const CustomBaseError = BaseError.subclass('CustomBaseError', {
  custom: class extends BaseError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: true },
      extra?: true,
    ) {
      super(message, options)
    }
  },
})
const DeepCustomError = CustomError.subclass('DeepCustomError', {
  custom: class extends CustomError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: true; propTwo?: true },
      extra?: boolean,
    ) {
      super(message, options, true)
    }
  },
})

new ModernError('')
new BaseError('')
new DeepBaseError('')
new CustomError('', { prop: true }, true)
new ChildCustomError('', { prop: true }, true)
new CustomBaseError('', { prop: true }, true)
new DeepCustomError('', { prop: true, propTwo: true }, false)

expectError(new ModernError())
expectError(new BaseError())
expectError(new DeepBaseError())
expectError(new CustomError())
expectError(new ChildCustomError())
expectError(new CustomBaseError())
expectError(new DeepCustomError())

expectError(new ModernError(true))
expectError(new BaseError(true))
expectError(new DeepBaseError(true))
expectError(new CustomError(true))
expectError(new ChildCustomError(true))
expectError(new CustomBaseError(true))
expectError(new DeepCustomError(true))

expectError(new ModernError('', true))
expectError(new BaseError('', true))
expectError(new DeepBaseError('', true))
expectError(new CustomError('', true))
expectError(new ChildCustomError('', true))
expectError(new CustomBaseError('', true))
expectError(new DeepCustomError('', true))

expectError(new BaseError('', { other: true }))
expectError(new DeepBaseError('', { other: true }))
expectError(new CustomError('', { other: true }))
expectError(new ChildCustomError('', { other: true }))
expectError(new CustomBaseError('', { other: true }))
expectError(new DeepCustomError('', { other: true }))

expectError(new ModernError('', { cause: '', other: true }))
expectError(new BaseError('', { cause: '', other: true }))
expectError(new DeepBaseError('', { cause: '', other: true }))
expectError(new CustomError('', { cause: '', other: true }))
expectError(new ChildCustomError('', { cause: '', other: true }))
expectError(new CustomBaseError('', { cause: '', other: true }))
expectError(new DeepCustomError('', { cause: '', other: true }))

expectError(new CustomError('', { prop: false }))
expectError(new ChildCustomError('', { prop: false }))
expectError(new CustomBaseError('', { prop: false }))
expectError(new DeepCustomError('', { prop: false }))
expectError(new DeepCustomError('', { propTwo: false }))

expectError(new CustomError('', {}, false))
expectError(new ChildCustomError('', {}, false))
expectError(new CustomBaseError('', {}, false))
expectError(new DeepCustomError('', {}, ''))

expectError(new CustomError('', {}, true, true))
expectError(new ChildCustomError('', {}, true, true))
expectError(new CustomBaseError('', {}, true, true))
expectError(new CustomBaseError('', {}, true, true))
