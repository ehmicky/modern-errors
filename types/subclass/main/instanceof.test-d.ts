import { expectType } from 'tsd'

import modernErrors from 'modern-errors'

const NoPluginsBaseError = modernErrors()
const BaseError = modernErrors([
  {
    name: 'test' as const,
    instanceMethods: { instanceMethod: () => {} },
    staticMethods: { staticMethod: () => {} },
  },
])

const ChildError = BaseError.subclass('ChildError')
const DeepChildError = ChildError.subclass('DeepChildError')
const CustomError = BaseError.subclass('CustomError', {
  custom: class extends BaseError {
    prop = false as const
  },
})
const ConflictCustomError = BaseError.subclass('ConflictCustomError', {
  custom: class extends BaseError {
    prop = true as const
  },
})
const ChildCustomError = CustomError.subclass('ChildCustomError')
const DeepCustomError = CustomError.subclass('DeepCustomError', {
  custom: class extends CustomError {
    propTwo = true
  },
})

const unknownError = new BaseError('', { cause: '' })
const childError = new ChildError('')
const deepChildError = new DeepChildError('')
const customError = new CustomError('')
const childCustomError = new ChildCustomError('')
const deepCustomError = new DeepCustomError('')

const exception = {} as unknown
if (exception instanceof NoPluginsBaseError) {
  expectType<typeof NoPluginsBaseError['prototype']>(exception)
}
// TODO: fix
// if (exception instanceof ChildError) {
//   expectType<typeof ChildError['prototype']>(exception)
// }
// if (exception instanceof DeepChildError) {
//   expectType<typeof DeepChildError['prototype']>(exception)
// }
// if (exception instanceof CustomError) {
//   expectType<typeof CustomError['prototype']>(exception)
// }
// if (exception instanceof ChildCustomError) {
//   expectType<typeof ChildCustomError['prototype']>(exception)
// }
// if (exception instanceof DeepCustomError) {
//   expectType<typeof DeepCustomError['prototype']>(exception)
// }

if (childError instanceof ChildError) {
  expectType<typeof childError>(childError)
}
if (deepChildError instanceof DeepChildError) {
  expectType<typeof deepChildError>(deepChildError)
}
if (customError instanceof CustomError) {
  expectType<typeof customError>(customError)
}
if (childCustomError instanceof ChildCustomError) {
  expectType<typeof childCustomError>(childCustomError)
}
if (deepCustomError instanceof DeepCustomError) {
  expectType<typeof deepCustomError>(deepCustomError)
}

if (unknownError instanceof BaseError) {
  expectType<typeof unknownError>(unknownError)
}
if (childError instanceof BaseError) {
  expectType<typeof childError>(childError)
}
if (deepChildError instanceof BaseError) {
  expectType<typeof deepChildError>(deepChildError)
}
if (customError instanceof BaseError) {
  expectType<typeof customError>(customError)
}
if (childCustomError instanceof BaseError) {
  expectType<typeof childCustomError>(childCustomError)
}
if (deepCustomError instanceof BaseError) {
  expectType<typeof deepCustomError>(deepCustomError)
}

if (unknownError instanceof Error) {
  expectType<typeof unknownError>(unknownError)
}
if (childError instanceof Error) {
  expectType<typeof childError>(childError)
}
if (deepChildError instanceof Error) {
  expectType<typeof deepChildError>(deepChildError)
}
if (customError instanceof Error) {
  expectType<typeof customError>(customError)
}
if (childCustomError instanceof Error) {
  expectType<typeof childCustomError>(childCustomError)
}
if (deepCustomError instanceof Error) {
  expectType<typeof deepCustomError>(deepCustomError)
}

if (deepChildError instanceof ChildError) {
  expectType<typeof deepChildError>(deepChildError)
}
if (childCustomError instanceof CustomError) {
  expectType<typeof childCustomError>(childCustomError)
}
if (deepCustomError instanceof CustomError) {
  expectType<typeof deepCustomError>(deepCustomError)
}

// TODO: fix
// if (customError instanceof ConflictCustomError) {
//   expectType<never>(customError)
// }
// if (childCustomError instanceof ConflictCustomError) {
//   expectType<never>(childCustomError)
// }
// if (deepCustomError instanceof ConflictCustomError) {
//   expectType<never>(deepCustomError)
// }
