import { expectType, expectError } from 'tsd'

import modernErrors, { Info } from 'modern-errors'

const name = 'test' as const

const BaseError = modernErrors()
const PropertyBaseError = modernErrors([
  { name, properties: () => ({ property: true as boolean }) },
])
const PropertyError = PropertyBaseError.subclass('PropertyError', {
  custom: class extends PropertyBaseError {
    property = true as const
  },
})
expectType<true>(new PropertyError('').property)

const InstanceMethodBaseError = modernErrors([
  {
    name,
    instanceMethods: {
      instanceMethod: (info: Info['instanceMethods'], arg: true) =>
        true as boolean,
    },
  },
])
const InstanceMethodError = InstanceMethodBaseError.subclass(
  'InstanceMethodError',
  {
    custom: class extends InstanceMethodBaseError {
      instanceMethod = (arg: boolean) => true as const
    },
  },
)
expectType<true>(new InstanceMethodError('').instanceMethod(true))

const StaticMethodBaseError = modernErrors([
  {
    name,
    staticMethods: {
      staticMethod: (info: Info['staticMethods'], arg: true) => true as boolean,
    },
  },
])
const StaticMethodError = StaticMethodBaseError.subclass('StaticMethodError', {
  custom: class extends StaticMethodBaseError {
    static staticMethod(arg: boolean) {
      return true as const
    }
  },
})
// TODO: fix. `custom` should have priority
expectType<boolean>(StaticMethodError.staticMethod(true))
const StaticMethodArrowError = StaticMethodBaseError.subclass(
  'StaticMethodArrowError',
  {
    custom: class extends StaticMethodBaseError {
      static staticMethod = (arg: boolean) => true as const
    },
  },
)
// TODO: fix. `custom` should have priority
expectType<boolean>(StaticMethodArrowError.staticMethod(true))

const PropsBaseError = modernErrors([], { props: { prop: true as boolean } })
const PropsError = PropsBaseError.subclass('PropsError', {
  custom: class extends PropsBaseError {
    prop = true as const
  },
})
expectType<true>(new PropsError('').prop)

// `tsd`'s `expectError()` fails to properly lint those, so they must be
// manually checked by uncommenting those lines.
// expectError(
//   class extends PropertyBaseError {
//     property = ''
//   },
// )
// expectError(
//   class extends InstanceMethodBaseError {
//     instanceMethod = (arg: true) => true as boolean | string
//   },
// )
// expectError(
//   class extends InstanceMethodBaseError {
//     instanceMethod = (arg: never) => true as boolean
//   },
// )
// expectError(
//   class extends StaticMethodBaseError {
//     static staticMethod(arg: true) {
//       return true as boolean | string
//     }
//   },
// )
// expectError(
//   class extends StaticMethodBaseError {
//     static staticMethod(arg: never) {
//       return true as boolean
//     }
//   },
// )
// expectError(
//   class extends StaticMethodBaseError {
//     static staticMethod = (arg: true) => true as boolean | string
//   },
// )
// expectError(
//   class extends StaticMethodBaseError {
//     static staticMethod = (arg: never) => true as boolean
//   },
// )
// expectError(
//   class extends PropsBaseError {
//     prop = true as boolean | string
//   },
// )
// expectError(
//   class extends BaseError {
//     message = true
//   },
// )
