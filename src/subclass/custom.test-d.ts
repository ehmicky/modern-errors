import ModernError, { type InstanceOptions, type Info } from 'modern-errors'
import { expectType } from 'tsd'

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

// @ts-expect-error
new ModernError()
// @ts-expect-error
new BaseError()
// @ts-expect-error
new DeepBaseError()
// @ts-expect-error
new CustomError()
// @ts-expect-error
new ChildCustomError()
// @ts-expect-error
new CustomBaseError()
// @ts-expect-error
new DeepCustomError()

// @ts-expect-error
new ModernError(true)
// @ts-expect-error
new BaseError(true)
// @ts-expect-error
new DeepBaseError(true)
// @ts-expect-error
new CustomError(true)
// @ts-expect-error
new ChildCustomError(true)
// @ts-expect-error
new CustomBaseError(true)
// @ts-expect-error
new DeepCustomError(true)

// @ts-expect-error
new ModernError('', true)
// @ts-expect-error
new BaseError('', true)
// @ts-expect-error
new DeepBaseError('', true)
// @ts-expect-error
new CustomError('', true)
// @ts-expect-error
new ChildCustomError('', true)
// @ts-expect-error
new CustomBaseError('', true)
// @ts-expect-error
new DeepCustomError('', true)

// @ts-expect-error
new BaseError('', { other: true })
// @ts-expect-error
new DeepBaseError('', { other: true })
// @ts-expect-error
new CustomError('', { other: true })
// @ts-expect-error
new ChildCustomError('', { other: true })
// @ts-expect-error
new CustomBaseError('', { other: true })
// @ts-expect-error
new DeepCustomError('', { other: true })

// @ts-expect-error
new ModernError('', { cause: '', other: true })
// @ts-expect-error
new BaseError('', { cause: '', other: true })
// @ts-expect-error
new DeepBaseError('', { cause: '', other: true })
// @ts-expect-error
new CustomError('', { cause: '', other: true })
// @ts-expect-error
new ChildCustomError('', { cause: '', other: true })
// @ts-expect-error
new CustomBaseError('', { cause: '', other: true })
// @ts-expect-error
new DeepCustomError('', { cause: '', other: true })

// @ts-expect-error
new CustomError('', { prop: false })
// @ts-expect-error
new ChildCustomError('', { prop: false })
// @ts-expect-error
new CustomBaseError('', { prop: false })
// @ts-expect-error
new DeepCustomError('', { prop: false })
// @ts-expect-error
new DeepCustomError('', { propTwo: false })

// @ts-expect-error
new CustomError('', {}, false)
// @ts-expect-error
new ChildCustomError('', {}, false)
// @ts-expect-error
new CustomBaseError('', {}, false)
// @ts-expect-error
new DeepCustomError('', {}, '')

// @ts-expect-error
new CustomError('', {}, true, true)
// @ts-expect-error
new ChildCustomError('', {}, true, true)
// @ts-expect-error
new CustomBaseError('', {}, true, true)
// @ts-expect-error
new CustomBaseError('', {}, true, true)

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

ModernError.subclass('TestError', {
  // @ts-expect-error
  custom: class extends ModernError {
    constructor(message: string, options?: true) {
      super(message, {})
    }
  },
})

ModernError.subclass('TestError', {
  // @ts-expect-error
  custom: class extends ModernError {
    constructor(message: string, options?: InstanceOptions & { cause: true }) {
      super(message, options)
    }
  },
})

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

ModernError.subclass('TestError', {
  // @ts-expect-error
  custom: class extends ModernError {
    constructor(options?: object) {
      super('', options)
    }
  },
})

ModernError.subclass('TestError', {
  custom: class extends ModernError {
    constructor() {
      // @ts-expect-error
      super()
    }
  },
})

CustomError.subclass('TestError', {
  custom: class extends CustomError {
    constructor(message: string, options?: InstanceOptions, extra?: true) {
      super(message, options, true)
    }
  },
})

CustomError.subclass('TestError', {
  // @ts-expect-error
  custom: class extends CustomError {
    constructor(
      message: string,
      options?: InstanceOptions & { prop?: false },
      extra?: true,
    ) {
      super(message, {}, true)
    }
  },
})

CustomError.subclass('TestError', {
  // @ts-expect-error
  custom: class extends CustomError {
    constructor(message: string, options?: InstanceOptions, extra?: false) {
      super(message, options, true)
    }
  },
})

CustomError.subclass('TestError', {
  custom: class TestError extends CustomError {
    constructor() {
      // @ts-expect-error
      super('', {}, false)
    }
  },
})

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

PropertyBaseError.subclass('TestError', {
  custom: class extends PropertyBaseError {
    // @ts-expect-error
    property = ''
  },
})

InstanceMethodBaseError.subclass('TestError', {
  custom: class extends InstanceMethodBaseError {
    // @ts-expect-error
    instanceMethod = (arg: true) => true as boolean | string
  },
})

InstanceMethodBaseError.subclass('TestError', {
  custom: class extends InstanceMethodBaseError {
    // @ts-expect-error
    instanceMethod = (arg: never) => true as boolean
  },
})

StaticMethodBaseError.subclass('TestError', {
  // @ts-expect-error
  custom: class extends StaticMethodBaseError {
    static staticMethod(arg: true) {
      return true as boolean | string
    }
  },
})

StaticMethodBaseError.subclass('TestError', {
  // @ts-expect-error
  custom: class extends StaticMethodBaseError {
    static staticMethod(arg: never) {
      return true as boolean
    }
  },
})

StaticMethodBaseError.subclass('TestError', {
  // @ts-expect-error
  custom: class extends StaticMethodBaseError {
    static staticMethod = (arg: true) => true as boolean | string
  },
})

StaticMethodBaseError.subclass('TestError', {
  // @ts-expect-error
  custom: class extends StaticMethodBaseError {
    static staticMethod = (arg: never) => true as boolean
  },
})

PropsBaseError.subclass('TestError', {
  custom: class extends PropsBaseError {
    // @ts-expect-error
    prop = true as boolean | string
  },
})

ModernError.subclass('TestError', {
  // @ts-expect-error
  custom: class extends ModernError {
    // @ts-expect-error
    message = true
  },
})
