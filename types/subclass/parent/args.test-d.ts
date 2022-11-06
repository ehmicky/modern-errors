import { expectError } from 'tsd'

import modernErrors, { InstanceOptions } from 'modern-errors'

const BaseError = modernErrors()

const ChildError = BaseError.subclass('ChildError')
const DeepChildError = ChildError.subclass('DeepChildError')
const CustomError = BaseError.subclass('CustomError', {
  custom: class extends BaseError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: true },
      extra?: true,
    ) {
      super(message, options, extra)
    }
  },
})
const ChildCustomError = CustomError.subclass('ChildCustomError')
const CustomChildError = ChildError.subclass('CustomChildError', {
  custom: class extends ChildError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: true },
      extra?: true,
    ) {
      super(message, options, extra)
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

new BaseError('', { cause: '' })
new ChildError('')
new DeepChildError('')
new CustomError('', { prop: true }, true)
new ChildCustomError('', { prop: true }, true)
new CustomChildError('', { prop: true }, true)
new DeepCustomError('', { prop: true, propTwo: true }, false)

expectError(new BaseError())
expectError(new ChildError())
expectError(new DeepChildError())
expectError(new CustomError())
expectError(new ChildCustomError())
expectError(new CustomChildError())
expectError(new DeepCustomError())

expectError(new BaseError(true))
expectError(new ChildError(true))
expectError(new DeepChildError(true))
expectError(new CustomError(true))
expectError(new ChildCustomError(true))
expectError(new CustomChildError(true))
expectError(new DeepCustomError(true))

expectError(new BaseError('', true))
expectError(new ChildError('', true))
expectError(new DeepChildError('', true))
expectError(new CustomError('', true))
expectError(new ChildCustomError('', true))
expectError(new CustomChildError('', true))
expectError(new DeepCustomError('', true))

expectError(new ChildError('', { other: true }))
expectError(new DeepChildError('', { other: true }))
expectError(new CustomError('', { other: true }))
expectError(new ChildCustomError('', { other: true }))
expectError(new CustomChildError('', { other: true }))
expectError(new DeepCustomError('', { other: true }))

expectError(new BaseError('', { cause: '', other: true }))
expectError(new ChildError('', { cause: '', other: true }))
expectError(new DeepChildError('', { cause: '', other: true }))
expectError(new CustomError('', { cause: '', other: true }))
expectError(new ChildCustomError('', { cause: '', other: true }))
expectError(new CustomChildError('', { cause: '', other: true }))
expectError(new DeepCustomError('', { cause: '', other: true }))

expectError(new CustomError('', { prop: false }))
expectError(new ChildCustomError('', { prop: false }))
expectError(new CustomChildError('', { prop: false }))
expectError(new DeepCustomError('', { prop: false }))
expectError(new DeepCustomError('', { propTwo: false }))

expectError(new CustomError('', {}, false))
expectError(new ChildCustomError('', {}, false))
expectError(new CustomChildError('', {}, false))
expectError(new DeepCustomError('', {}, ''))

expectError(new CustomError('', {}, true, true))
expectError(new ChildCustomError('', {}, true, true))
expectError(new CustomChildError('', {}, true, true))
expectError(new CustomChildError('', {}, true, true))
