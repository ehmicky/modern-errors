import { expectType, expectError } from 'tsd'

import modernErrors, { Info } from '../../main.js'

const name = 'test' as const

const AnyOneError = modernErrors([
  { name, properties: () => ({ property: true as boolean }) },
])
const OneError = AnyOneError.subclass('OneError', {
  custom: class extends AnyOneError {
    property = true as const
  },
})
expectType<true>(new OneError('').property)

const AnyTwoError = modernErrors([
  {
    name,
    instanceMethods: {
      instanceMethod: (info: Info['instanceMethods'], arg: true) =>
        true as boolean,
    },
  },
])
const TwoError = AnyTwoError.subclass('TwoError', {
  custom: class extends AnyTwoError {
    instanceMethod = (arg: boolean) => true as const
  },
})
expectType<true>(new TwoError('').instanceMethod(true))

const AnyThreeError = modernErrors([
  {
    name,
    staticMethods: {
      staticMethod: (info: Info['staticMethods'], arg: true) => true as boolean,
    },
  },
])
const ThreeError = AnyThreeError.subclass('ThreeError', {
  custom: class extends AnyThreeError {
    static staticMethod(arg: boolean) {
      return true as const
    }
  },
})
expectError(ThreeError.staticMethod(true))
const FourError = AnyThreeError.subclass('FourError', {
  custom: class extends AnyThreeError {
    static staticMethod = (arg: boolean) => true as const
  },
})
expectError(FourError.staticMethod(true))

const AnyFiveError = modernErrors([], { props: { prop: true as boolean } })
const FiveError = AnyFiveError.subclass('FiveError', {
  custom: class extends AnyFiveError {
    prop = true as const
  },
})
expectType<true>(new FiveError('').prop)

// `tsd`'s `expectError()` fails to properly lint those, so they must be
// manually checked by uncommenting those lines.
// expectError(
//   class extends AnyOneError {
//     property = ''
//   },
// )
// expectError(
//   class extends AnyTwoError {
//     instanceMethod = (arg: true) => true as boolean | string
//   },
// )
// expectError(
//   class extends AnyTwoError {
//     instanceMethod = (arg: never) => true as boolean
//   },
// )
// expectError(
//   class extends AnyThreeError {
//     static staticMethod(arg: true) {
//       return true as boolean | string
//     }
//   },
// )
// expectError(
//   class extends AnyThreeError {
//     static staticMethod(arg: never) {
//       return true as boolean
//     }
//   },
// )
// expectError(
//   class extends AnyThreeError {
//     static staticMethod = (arg: true) => true as boolean | string
//   },
// )
// expectError(
//   class extends AnyThreeError {
//     static staticMethod = (arg: never) => true as boolean
//   },
// )
// expectError(
//   class extends AnyFiveError {
//     prop = true as boolean | string
//   },
// )
// expectError(
//   class extends AnyError {
//     message = true
//   },
// )
