import { expectType, expectError } from 'tsd'

import modernErrors, { Info } from 'modern-errors'

const name = 'test' as const

const AnyError = modernErrors()
const PropertyAnyError = modernErrors([
  { name, properties: () => ({ property: true as boolean }) },
])
const PropertyError = PropertyAnyError.subclass('PropertyError', {
  custom: class extends PropertyAnyError {
    property = true as const
  },
})
expectType<true>(new PropertyError('').property)

const InstanceMethodAnyError = modernErrors([
  {
    name,
    instanceMethods: {
      instanceMethod: (info: Info['instanceMethods'], arg: true) =>
        true as boolean,
    },
  },
])
const InstanceMethodError = InstanceMethodAnyError.subclass(
  'InstanceMethodError',
  {
    custom: class extends InstanceMethodAnyError {
      instanceMethod = (arg: boolean) => true as const
    },
  },
)
expectType<true>(new InstanceMethodError('').instanceMethod(true))

const StaticMethodAnyError = modernErrors([
  {
    name,
    staticMethods: {
      staticMethod: (info: Info['staticMethods'], arg: true) => true as boolean,
    },
  },
])
const StaticMethodError = StaticMethodAnyError.subclass('StaticMethodError', {
  custom: class extends StaticMethodAnyError {
    static staticMethod(arg: boolean) {
      return true as const
    }
  },
})
expectError(StaticMethodError.staticMethod(true))
const StaticMethodArrowError = StaticMethodAnyError.subclass(
  'StaticMethodArrowError',
  {
    custom: class extends StaticMethodAnyError {
      static staticMethod = (arg: boolean) => true as const
    },
  },
)
expectError(StaticMethodArrowError.staticMethod(true))

const PropsAnyError = modernErrors([], { props: { prop: true as boolean } })
const PropsError = PropsAnyError.subclass('PropsError', {
  custom: class extends PropsAnyError {
    prop = true as const
  },
})
expectType<true>(new PropsError('').prop)

// `tsd`'s `expectError()` fails to properly lint those, so they must be
// manually checked by uncommenting those lines.
// expectError(
//   class extends PropertyAnyError {
//     property = ''
//   },
// )
// expectError(
//   class extends InstanceMethodAnyError {
//     instanceMethod = (arg: true) => true as boolean | string
//   },
// )
// expectError(
//   class extends InstanceMethodAnyError {
//     instanceMethod = (arg: never) => true as boolean
//   },
// )
// expectError(
//   class extends StaticMethodAnyError {
//     static staticMethod(arg: true) {
//       return true as boolean | string
//     }
//   },
// )
// expectError(
//   class extends StaticMethodAnyError {
//     static staticMethod(arg: never) {
//       return true as boolean
//     }
//   },
// )
// expectError(
//   class extends StaticMethodAnyError {
//     static staticMethod = (arg: true) => true as boolean | string
//   },
// )
// expectError(
//   class extends StaticMethodAnyError {
//     static staticMethod = (arg: never) => true as boolean
//   },
// )
// expectError(
//   class extends PropsAnyError {
//     prop = true as boolean | string
//   },
// )
// expectError(
//   class extends AnyError {
//     message = true
//   },
// )
