import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors from 'modern-errors'
import modernErrorsExample, { Options } from 'modern-errors-example'

// Check the plugin shape by passing it to `modernErrors()`
const BaseError = modernErrors([modernErrorsExample])
const error = new BaseError('', { cause: '' })

// Check `plugin.properties()`
expectType<string>(error.exampleProp)
expectError(error.unknownProp)

// Check `plugin.instanceMethods`
expectType<string>(error.exampleMethod('validArgument'))
expectError(error.exampleMethod('invalidArgument'))

// Check `plugin.staticMethods`
expectType<string>(BaseError.staticMethod('validArgument'))
expectError(BaseError.staticMethod('invalidArgument'))

// Check `plugin.getOptions()`, `plugin.isOptions()` and `plugin.name`
modernErrors([modernErrorsExample], { exampleOption: 'validOption' })
error.exampleMethod('validArgument', { exampleOption: 'validOption' })
BaseError.staticMethod('validArgument', { exampleOption: 'validOption' })
expectAssignable<Options>({ exampleOption: 'validOption' })
expectError(
  modernErrors([modernErrorsExample], { exampleOption: 'invalidOption' }),
)
expectError(
  error.exampleMethod('validArgument', { exampleOption: 'invalidOption' }),
)
expectError(
  BaseError.staticMethod('validArgument', { exampleOption: 'invalidOption' }),
)
expectNotAssignable<Options>({ exampleOption: 'invalidOption' })
