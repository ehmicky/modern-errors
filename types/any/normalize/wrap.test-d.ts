import { expectType, expectError } from 'tsd'

import modernErrors, { Plugin } from '../../main.js'

const AnyError = modernErrors()
const CustomError = AnyError.subclass('CustomError', {
  custom: class extends AnyError {
    prop = true
  },
})
const customError = new CustomError('')
type CustomInstance = typeof CustomError['prototype']

expectType<CustomInstance>(new AnyError('', { cause: customError }))
expectType<CustomInstance>(AnyError.normalize(customError))

const PluginAnyError = modernErrors([{ name: 'test' as const }])
const PluginCustomError = PluginAnyError.subclass('PluginCustomError', {
  custom: class extends PluginAnyError {
    prop = true
  },
})
const pluginCustomError = new PluginCustomError('')
type PluginCustomInstance = typeof PluginCustomError['prototype']

expectType<PluginCustomInstance>(
  new PluginAnyError('', { cause: pluginCustomError }),
)
expectType<PluginCustomInstance>(PluginAnyError.normalize(pluginCustomError))

const WideError = modernErrors([{} as Plugin])

expectType<PluginCustomInstance>(
  new WideError('', { cause: pluginCustomError }),
)
expectType<PluginCustomInstance>(WideError.normalize(pluginCustomError))

const cause = {} as Error & { prop: true }
expectType<true>(new AnyError('', { cause }).prop)
expectType<true>(AnyError.normalize(cause).prop)

expectError(AnyError.normalize('', true))
