import { expectType, expectAssignable, expectNotAssignable } from 'tsd'

import ModernError from 'modern-errors'
import modernErrorsExample, { Options } from 'modern-errors-example'

// Check the plugin shape by passing it to `modernErrors()`
const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsExample],
})
const error = new BaseError('')

// Check `plugin.properties()`
expectType<string>(error.exampleProp)
// @ts-expect-error
error.unknownProp

// Check `plugin.instanceMethods`
expectType<string>(BaseError.exampleMethod(error, 'validArgument'))
// @ts-expect-error
BaseError.exampleMethod(error, 'invalidArgument')

// Check `plugin.staticMethods`
expectType<string>(BaseError.staticMethod('validArgument'))
// @ts-expect-error
BaseError.staticMethod('invalidArgument')

// Check `plugin.getOptions()`, `plugin.isOptions()` and `plugin.name`
ModernError.subclass('TestError', {
  plugins: [modernErrorsExample],
  exampleOption: 'validOption',
})
BaseError.exampleMethod(error, 'validArgument', {
  exampleOption: 'validOption',
})
BaseError.staticMethod('validArgument', { exampleOption: 'validOption' })
expectAssignable<Options>({ exampleOption: 'validOption' })
// @ts-expect-error
ModernError.subclass('TestError', {
  plugins: [modernErrorsExample],
  exampleOption: 'invalidOption',
})
// @ts-expect-error
BaseError.exampleMethod(error, 'validArgument', {
  exampleOption: 'invalidOption',
})
// @ts-expect-error
BaseError.staticMethod('validArgument', { exampleOption: 'invalidOption' })
expectNotAssignable<Options>({ exampleOption: 'invalidOption' })
