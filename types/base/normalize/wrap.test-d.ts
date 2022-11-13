import { expectType, expectAssignable, expectError } from 'tsd'

import ModernError, { Plugin } from 'modern-errors'

const CustomError = ModernError.subclass('CustomError', {
  custom: class extends ModernError {
    prop = true
  },
})
const customError = new CustomError('')
type CustomInstance = typeof CustomError['prototype']

expectAssignable<CustomInstance>(new ModernError('', { cause: customError }))
expectType<CustomInstance>(ModernError.normalize(customError))

const PluginBaseError = ModernError.subclass('PluginBaseError', {
  plugins: [{ name: 'test' as const }],
})
const PluginCustomError = PluginBaseError.subclass('PluginCustomError', {
  custom: class extends PluginBaseError {
    prop = true
  },
})
const pluginCustomError = new PluginCustomError('')
type PluginCustomInstance = typeof PluginCustomError['prototype']

expectAssignable<PluginCustomInstance>(
  new PluginBaseError('', { cause: pluginCustomError }),
)
expectType<PluginCustomInstance>(PluginBaseError.normalize(pluginCustomError))

const WideError = ModernError.subclass('WideError', { plugins: [{} as Plugin] })

expectAssignable<PluginCustomInstance>(
  new WideError('', { cause: pluginCustomError }),
)
expectType<PluginCustomInstance>(WideError.normalize(pluginCustomError))

const cause = {} as Error & { prop: true }
expectType<true>(new ModernError('', { cause }).prop)
expectType<true>(ModernError.normalize(cause).prop)

expectError(ModernError.normalize('', true))
