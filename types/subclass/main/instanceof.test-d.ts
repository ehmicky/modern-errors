import { expectType } from 'tsd'

import modernErrors from '../../main.js'

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>

const CustomOneError = AnyError.subclass('CustomOneError', {
  custom: class extends AnyError {
    prop = true as const
  },
})
const CustomTwoError = AnyError.subclass('CustomTwoError', {
  custom: class extends AnyError {
    prop = false as const
  },
})
const DeepCustomError = CustomTwoError.subclass('DeepCustomError')
const unknownError = new AnyError('', { cause: '' })
const customError = new CustomTwoError('')
const deepCustomError = new DeepCustomError('')

const exception = {} as unknown
if (exception instanceof AnyError) {
  expectType<AnyInstance>(exception)
}
if (exception instanceof CustomTwoError) {
  expectType<typeof CustomTwoError['prototype']>(exception)
}
if (exception instanceof DeepCustomError) {
  expectType<typeof DeepCustomError['prototype']>(exception)
}
if (customError instanceof CustomOneError) {
  expectType<never>(customError)
}
if (deepCustomError instanceof CustomOneError) {
  expectType<never>(deepCustomError)
}
if (customError instanceof CustomTwoError) {
  expectType<typeof customError>(customError)
}
if (deepCustomError instanceof DeepCustomError) {
  expectType<typeof deepCustomError>(deepCustomError)
}
if (customError instanceof AnyError) {
  expectType<typeof customError>(customError)
}
if (deepCustomError instanceof AnyError) {
  expectType<typeof deepCustomError>(deepCustomError)
}
if (unknownError instanceof AnyError) {
  expectType<typeof unknownError>(unknownError)
}
if (customError instanceof Error) {
  expectType<typeof customError>(customError)
}
if (deepCustomError instanceof Error) {
  expectType<typeof deepCustomError>(deepCustomError)
}
