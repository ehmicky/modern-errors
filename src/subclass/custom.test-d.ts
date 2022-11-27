import { expectType, expectError, expectNotAssignable } from 'tsd'

import ModernError, { InstanceOptions, Info } from 'modern-errors'

const AttributesError = ModernError.subclass('AttributesError', {
  custom: class extends ModernError {
    prop = true as const
    static staticProp = true as const
  },
})
const ChildAttributesError = AttributesError.subclass('ChildAttributesError')
const DeepAttributesError = AttributesError.subclass('DeepAttributesError', {
  custom: class extends AttributesError {
    deepProp = true as const
    static staticDeepProp = true as const
  },
})
const BaseError = ModernError.subclass('BaseError')
const AttributesBaseError = BaseError.subclass('AttributesBaseError', {
  custom: class extends BaseError {
    prop = true as const
    static staticProp = true as const
  },
})

expectType<true>(new AttributesError('').prop)
expectType<true>(new ChildAttributesError('').prop)
expectType<true>(new DeepAttributesError('').prop)
expectType<true>(new DeepAttributesError('').deepProp)
expectType<true>(new AttributesBaseError('').prop)

expectType<true>(AttributesError.staticProp)
expectType<true>(ChildAttributesError.staticProp)
expectType<true>(DeepAttributesError.staticProp)
expectType<true>(DeepAttributesError.staticDeepProp)
expectType<true>(AttributesBaseError.staticProp)

const DeepBaseError = BaseError.subclass('DeepBaseError')
const CustomError = ModernError.subclass('CustomError', {
  custom: class extends ModernError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: true },
      extra?: true,
    ) {
      super(message, options)
    }
  },
})
const ChildCustomError = CustomError.subclass('ChildCustomError')
const CustomBaseError = BaseError.subclass('CustomBaseError', {
  custom: class extends BaseError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: true },
      extra?: true,
    ) {
      super(message, options)
    }
  },
})
const DeepCustomError = CustomError.subclass('DeepCustomError', {
  custom: class extends CustomError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: true; propTwo?: true },
      extra?: boolean,
    ) {
      super(message, options, true)
    }
  },
})

new ModernError('')
new BaseError('')
new DeepBaseError('')
new CustomError('', { prop: true }, true)
new ChildCustomError('', { prop: true }, true)
new CustomBaseError('', { prop: true }, true)
new DeepCustomError('', { prop: true, propTwo: true }, false)

expectError(new ModernError())
expectError(new BaseError())
expectError(new DeepBaseError())
expectError(new CustomError())
expectError(new ChildCustomError())
expectError(new CustomBaseError())
expectError(new DeepCustomError())

expectError(new ModernError(true))
expectError(new BaseError(true))
expectError(new DeepBaseError(true))
expectError(new CustomError(true))
expectError(new ChildCustomError(true))
expectError(new CustomBaseError(true))
expectError(new DeepCustomError(true))

expectError(new ModernError('', true))
expectError(new BaseError('', true))
expectError(new DeepBaseError('', true))
expectError(new CustomError('', true))
expectError(new ChildCustomError('', true))
expectError(new CustomBaseError('', true))
expectError(new DeepCustomError('', true))

expectError(new BaseError('', { other: true }))
expectError(new DeepBaseError('', { other: true }))
expectError(new CustomError('', { other: true }))
expectError(new ChildCustomError('', { other: true }))
expectError(new CustomBaseError('', { other: true }))
expectError(new DeepCustomError('', { other: true }))

expectError(new ModernError('', { cause: '', other: true }))
expectError(new BaseError('', { cause: '', other: true }))
expectError(new DeepBaseError('', { cause: '', other: true }))
expectError(new CustomError('', { cause: '', other: true }))
expectError(new ChildCustomError('', { cause: '', other: true }))
expectError(new CustomBaseError('', { cause: '', other: true }))
expectError(new DeepCustomError('', { cause: '', other: true }))

expectError(new CustomError('', { prop: false }))
expectError(new ChildCustomError('', { prop: false }))
expectError(new CustomBaseError('', { prop: false }))
expectError(new DeepCustomError('', { prop: false }))
expectError(new DeepCustomError('', { propTwo: false }))

expectError(new CustomError('', {}, false))
expectError(new ChildCustomError('', {}, false))
expectError(new CustomBaseError('', {}, false))
expectError(new DeepCustomError('', {}, ''))

expectError(new CustomError('', {}, true, true))
expectError(new ChildCustomError('', {}, true, true))
expectError(new CustomBaseError('', {}, true, true))
expectError(new CustomBaseError('', {}, true, true))

ModernError.subclass('TestError', {
  custom: class extends ModernError {
    constructor(message: string, options?: InstanceOptions) {
      super(message, options)
    }
  },
})

ModernError.subclass('TestError', {
  custom: class extends ModernError {
    constructor(message: string, options?: object) {
      super(message, options)
    }
  },
})

ModernError.subclass('TestError', {
  custom: class extends ModernError {
    constructor(
      message: string,
      options?: ConstructorParameters<typeof ModernError>[1],
    ) {
      super(message, options)
    }
  },
})

expectError(
  ModernError.subclass('TestError', {
    custom: class extends ModernError {
      constructor(message: string, options?: true) {
        super(message, {})
      }
    },
  }),
)

expectError(
  ModernError.subclass('TestError', {
    custom: class extends ModernError {
      constructor(
        message: string,
        options?: InstanceOptions & { cause: true },
      ) {
        super(message, options)
      }
    },
  }),
)

ModernError.subclass('TestError', {
  custom: class extends ModernError {
    constructor(
      message: ConstructorParameters<typeof ModernError>[0],
      options?: InstanceOptions,
    ) {
      super(message, options)
    }
  },
})

expectError(
  ModernError.subclass('TestError', {
    custom: class extends ModernError {
      constructor(options?: object) {
        super('', options)
      }
    },
  }),
)

expectError(
  ModernError.subclass('TestError', {
    custom: class extends ModernError {
      constructor() {
        super()
      }
    },
  }),
)

CustomError.subclass('TestError', {
  custom: class extends CustomError {
    constructor(message: string, options?: InstanceOptions, extra?: true) {
      super(message, options, true)
    }
  },
})

// `tsd`'s `expectError()` fails at validating the following, so we need to
// use more complex `expectNotAssignable` assertions.
expectNotAssignable<
  NonNullable<NonNullable<Parameters<typeof CustomError.subclass>[1]>['custom']>
>(
  class extends CustomError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: false },
      extra?: true,
    ) {
      super(message, {}, true)
    }
  },
)

expectNotAssignable<
  NonNullable<NonNullable<Parameters<typeof CustomError.subclass>[1]>['custom']>
>(
  class extends CustomError {
    constructor(message: string, options?: InstanceOptions, extra?: false) {
      super(message, options, true)
    }
  },
)

expectError(
  class extends CustomError {
    constructor() {
      super('', {}, false)
    }
  },
)

const plugins = [{ name: 'test' as const }]
const PluginBaseError = ModernError.subclass('PluginBaseError', { plugins })

PluginBaseError.subclass('TestError', {
  custom: class extends PluginBaseError {
    constructor(message: string, options?: InstanceOptions) {
      super(message, options)
    }
  },
})

PluginBaseError.subclass('TestError', {
  custom: class extends PluginBaseError {
    constructor(message: string, options?: InstanceOptions<typeof plugins>) {
      super(message, options)
    }
  },
})

const name = 'test' as const

const PropertyBaseError = ModernError.subclass('PropertyBaseError', {
  plugins: [{ name, properties: () => ({ property: true as boolean }) }],
})
const PropertyError = PropertyBaseError.subclass('PropertyError', {
  custom: class extends PropertyBaseError {
    property = true as const
  },
})
expectType<true>(new PropertyError('').property)

const InstanceMethodBaseError = ModernError.subclass(
  'InstanceMethodBaseError',
  {
    plugins: [
      {
        name,
        instanceMethods: {
          instanceMethod: (info: Info['instanceMethods'], arg: true) =>
            true as boolean,
        },
      },
    ],
  },
)
const InstanceMethodError = InstanceMethodBaseError.subclass(
  'InstanceMethodError',
  {
    custom: class extends InstanceMethodBaseError {
      instanceMethod = (arg: boolean) => true as const
    },
  },
)
expectType<true>(new InstanceMethodError('').instanceMethod(true))

const StaticMethodBaseError = ModernError.subclass('StaticMethodBaseError', {
  plugins: [
    {
      name,
      staticMethods: {
        staticMethod: (info: Info['staticMethods'], arg: true) =>
          true as boolean,
      },
    },
  ],
})
const StaticMethodError = StaticMethodBaseError.subclass('StaticMethodError', {
  custom: class extends StaticMethodBaseError {
    static staticMethod(arg: boolean) {
      return true as const
    }
  },
})
expectType<true>(StaticMethodError.staticMethod(true))
const StaticMethodArrowError = StaticMethodBaseError.subclass(
  'StaticMethodArrowError',
  {
    custom: class extends StaticMethodBaseError {
      static staticMethod = (arg: boolean) => true as const
    },
  },
)
expectType<true>(StaticMethodArrowError.staticMethod(true))

const PropsBaseError = ModernError.subclass('PropsBaseError', {
  props: { prop: true as boolean },
})
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
//   class extends ModernError {
//     message = true
//   },
// )
