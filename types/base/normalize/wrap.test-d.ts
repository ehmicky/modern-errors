import { expectType, expectError } from 'tsd'

import modernErrors, { Plugin } from 'modern-errors'

const BaseError = modernErrors()
const CustomError = BaseError.subclass('CustomError', {
  custom: class extends BaseError {
    prop = true
  },
})
const customError = new CustomError('')
type CustomInstance = typeof CustomError['prototype']

expectType<CustomInstance>(new BaseError('', { cause: customError }))
expectType<CustomInstance>(BaseError.normalize(customError))

const PluginBaseError = modernErrors([{ name: 'test' as const }])
const PluginCustomError = PluginBaseError.subclass('PluginCustomError', {
  custom: class extends PluginBaseError {
    prop = true
  },
})
const pluginCustomError = new PluginCustomError('')
type PluginCustomInstance = typeof PluginCustomError['prototype']

expectType<PluginCustomInstance>(
  new PluginBaseError('', { cause: pluginCustomError }),
)
expectType<PluginCustomInstance>(PluginBaseError.normalize(pluginCustomError))

const WideError = modernErrors([{} as Plugin])

expectType<PluginCustomInstance>(
  new WideError('', { cause: pluginCustomError }),
)
expectType<PluginCustomInstance>(WideError.normalize(pluginCustomError))

const cause = {} as Error & { prop: true }
expectType<true>(new BaseError('', { cause }).prop)
expectType<true>(BaseError.normalize(cause).prop)

expectError(BaseError.normalize('', true))
