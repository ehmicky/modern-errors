import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'
import type { ErrorName } from 'error-custom-class'

import modernErrors, {
  AnyErrorClass,
  ErrorClass,
  ErrorInstance,
  GlobalOptions,
  ClassOptions,
  InstanceOptions,
  Plugin,
  Info,
} from './main.js'

import './any/aggregate.test-d.js'
import './core_plugins/props.test-d.js'
import './options/class.test-d.js'
import './options/plugins.test-d.js'
import './plugins/info.test-d.js'
import './plugins/instance.test-d.js'
import './plugins/properties.test-d.js'
import './plugins/shape.test-d.js'
import './plugins/static.test-d.js'

const exception = {} as unknown

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>
const wideError = {} as any as AnyInstance
expectAssignable<AnyErrorClass>(AnyError)
expectAssignable<ErrorClass>(AnyError)
expectAssignable<ErrorInstance>(wideError)
expectAssignable<Error>(wideError)
expectType<ErrorName>(wideError.name)
expectAssignable<Error>({} as ErrorInstance)
expectType<ErrorInstance>({} as InstanceType<ErrorClass>)

const SError = AnyError.subclass('SError')
type SInstance = typeof SError['prototype']
const sError = new SError('')
expectNotAssignable<AnyErrorClass>(SError)
expectAssignable<ErrorClass>(SError)
expectAssignable<SInstance>(sError)
expectAssignable<AnyInstance>(sError)
expectAssignable<ErrorInstance>(sError)
expectAssignable<Error>(sError)
expectType<'SError'>(sError.name)
expectError(SError.normalize(''))
if (exception instanceof SError) {
  expectType<SInstance>(exception)
}

const unknownError = new AnyError('', { cause: '' })
type UnknownInstance = typeof unknownError

expectAssignable<AnyInstance>(unknownError)
expectAssignable<ErrorInstance>(unknownError)
expectAssignable<Error>(unknownError)
expectAssignable<UnknownInstance>(unknownError)
expectType<'UnknownError'>('' as UnknownInstance['name'])
expectType<'UnknownError'>(unknownError.name)
expectType<ErrorName>({} as ReturnType<typeof AnyError.normalize>['name'])
expectNotAssignable<UnknownInstance>(new AnyError('', { cause: sError }))
expectAssignable<SInstance>(AnyError.normalize(sError))
expectAssignable<UnknownInstance>(new AnyError('', { cause: unknownError }))
expectAssignable<UnknownInstance>(AnyError.normalize(unknownError))
expectAssignable<UnknownInstance>(new AnyError('', { cause: new Error('') }))
expectAssignable<UnknownInstance>(AnyError.normalize(new Error('')))
expectAssignable<UnknownInstance>(new AnyError('', { cause: undefined }))
expectAssignable<UnknownInstance>(AnyError.normalize(undefined))
expectAssignable<UnknownInstance>(AnyError.normalize(''))
if (unknownError instanceof AnyError) {
  expectAssignable<UnknownInstance>(unknownError)
}

const anyError = new AnyError('', { cause: sError })
expectError(new AnyError())
expectError(new AnyError(true))
expectError(new AnyError('', true))
expectError(new AnyError('', { cause: '', other: true }))
expectAssignable<SInstance>(anyError)
expectAssignable<ErrorInstance>(anyError)
expectAssignable<Error>(anyError)
expectType<'SError'>(anyError.name)
expectAssignable<SInstance>(AnyError.normalize(sError))
expectError(AnyError.normalize('', true))
if (exception instanceof AnyError) {
  expectAssignable<AnyInstance>(exception)
}

const SSError = SError.subclass('SSError')
type SSInstance = typeof SSError['prototype']

const ssError = new SSError('')
expectNotAssignable<AnyErrorClass>(SSError)
expectAssignable<ErrorClass>(SSError)
expectAssignable<SSInstance>(ssError)
expectAssignable<AnyInstance>(ssError)
expectAssignable<ErrorInstance>(ssError)
expectAssignable<Error>(ssError)
expectType<'SSError'>(ssError.name)
expectError(SSError.normalize(''))
if (exception instanceof SSError) {
  expectType<SSInstance>(exception)
}

class BCError extends AnyError {
  constructor(
    message: string,
    options?: InstanceOptions & { cProp?: true },
    extra?: true,
  ) {
    super(message, options, extra)
  }
  prop = true as const
  static staticProp = true as const
}
const CError = AnyError.subclass('CError', { custom: BCError })
type CInstance = typeof CError['prototype']

const cError = new CError('', { cProp: true })
expectError(new CError())
expectError(new CError(true))
expectError(new CError('', true))
expectError(new CError('', { other: true }))
expectError(new CError('', { cause: '', other: true }))
expectError(new CError('', { cProp: false }))
expectNotAssignable<AnyErrorClass>(CError)
expectAssignable<ErrorClass>(CError)
expectAssignable<CInstance>(cError)
expectAssignable<AnyInstance>(cError)
expectAssignable<ErrorInstance>(cError)
expectAssignable<Error>(cError)
expectType<true>(cError.prop)
expectType<true>(CError.staticProp)
expectType<'CError'>(cError.name)
expectError(CError.normalize(''))

const SCError = CError.subclass('SCError')
type SCInstance = typeof SCError['prototype']

const scError = new SCError('', { cProp: true })
expectError(new SCError())
expectError(new SCError(true))
expectError(new SCError('', true))
expectError(new SCError('', { other: true }))
expectError(new SCError('', { cause: '', other: true }))
expectError(new SCError('', { cProp: false }))
expectNotAssignable<AnyErrorClass>(SCError)
expectAssignable<ErrorClass>(SCError)
expectAssignable<SCInstance>(scError)
expectAssignable<AnyInstance>(scError)
expectAssignable<ErrorInstance>(scError)
expectAssignable<Error>(scError)
expectType<true>(scError.prop)
expectType<true>(SCError.staticProp)
expectType<'SCError'>(scError.name)
expectError(SCError.normalize(''))

class BCSError extends SError {
  constructor(
    message: string,
    options?: InstanceOptions & { cProp?: true },
    extra?: true,
  ) {
    super(message, options, extra)
  }
  prop = true as const
  static staticProp = true as const
}
const CSError = SError.subclass('CSError', { custom: BCSError })
type CSInstance = typeof CSError['prototype']

const csError = new CSError('', { cProp: true })
expectError(new CSError())
expectError(new CSError(true))
expectError(new CSError('', true))
expectError(new CSError('', { other: true }))
expectError(new CSError('', { cause: '', other: true }))
expectError(new CSError('', { cProp: false }))
expectNotAssignable<AnyErrorClass>(CSError)
expectAssignable<ErrorClass>(CSError)
expectAssignable<CSInstance>(csError)
expectAssignable<AnyInstance>(csError)
expectAssignable<ErrorInstance>(csError)
expectAssignable<Error>(csError)
expectType<true>(csError.prop)
expectType<true>(CSError.staticProp)
expectType<'CSError'>(csError.name)
expectError(CSError.normalize(''))

class BCCError extends CError {
  constructor(
    message: string,
    options?: InstanceOptions & { cProp?: true; ccProp?: true },
    extra?: boolean,
  ) {
    super(message, options, true)
  }
  deepProp = true as const
  static deepStaticProp = true as const
}
const CCError = CError.subclass('CCError', { custom: BCCError })
type CCInstance = typeof CCError['prototype']

const ccError = new CCError('', { cProp: true, ccProp: true })
expectError(new CCError())
expectError(new CCError(true))
expectError(new CCError('', true))
expectError(new CCError('', { other: true }))
expectError(new CCError('', { cause: '', other: true }))
expectError(new CCError('', { cProp: false }))
expectError(new CCError('', { ccProp: false }))
expectNotAssignable<AnyErrorClass>(CCError)
expectAssignable<ErrorClass>(CCError)
expectAssignable<CCInstance>(ccError)
expectAssignable<AnyInstance>(ccError)
expectAssignable<ErrorInstance>(ccError)
expectAssignable<Error>(ccError)
expectType<true>(ccError.prop)
expectType<true>(ccError.deepProp)
expectType<true>(CCError.staticProp)
expectType<true>(CCError.deepStaticProp)
expectType<'CCError'>(ccError.name)
expectError(CCError.normalize(''))

const cause = {} as Error & { prop: true }
expectType<true>(new AnyError('', { cause }).prop)
expectAssignable<InstanceOptions>({ cause: '' })
expectNotAssignable<GlobalOptions>({ cause: '' })
expectNotAssignable<ClassOptions>({ cause: '' })

const name = 'test' as const
const staticMethod = (info: Info['staticMethods'], arg: 'arg') => arg
const staticMethods = { staticMethod }
const properties = (info: Info['properties']) => ({ property: true } as const)
const plugin = { name, staticMethods, properties } as const

const PAnyError = modernErrors([plugin])
const PSError = PAnyError.subclass('PSError')
const GPAnyError = modernErrors([{} as Plugin])
const GPSError = GPAnyError.subclass('GPSError')
type PAnyErrorClass = AnyErrorClass<[typeof plugin]>
type PErrorClass = ErrorClass<[typeof plugin]>

expectAssignable<AnyErrorClass>(PAnyError)
expectAssignable<PAnyErrorClass>(PAnyError)
expectAssignable<ErrorClass>(PAnyError)
expectAssignable<PErrorClass>(PAnyError)
expectNotAssignable<AnyErrorClass>(PSError)
expectNotAssignable<PAnyErrorClass>(PSError)
expectAssignable<ErrorClass>(PSError)
expectAssignable<PErrorClass>(PSError)
expectAssignable<AnyErrorClass>(GPAnyError)
expectNotAssignable<PAnyErrorClass>(GPAnyError)
expectAssignable<ErrorClass>(GPAnyError)
expectNotAssignable<PErrorClass>(GPAnyError)
expectNotAssignable<AnyErrorClass>(GPSError)
expectNotAssignable<PAnyErrorClass>(GPSError)
expectAssignable<ErrorClass>(GPSError)
expectNotAssignable<PErrorClass>(GPSError)

const paError = new PAnyError('', { cause: '' })
const psError = new PSError('')
const gpaError = new GPAnyError('', { cause: '' })
const gpsError = new GPSError('')
type PErrorInstance = ErrorInstance<[typeof plugin]>

expectAssignable<Error>(paError)
expectAssignable<ErrorInstance>(paError)
expectAssignable<PErrorInstance>(paError)
expectAssignable<Error>(psError)
expectAssignable<ErrorInstance>(psError)
expectAssignable<PErrorInstance>(psError)
expectAssignable<Error>(gpaError)
expectAssignable<ErrorInstance>(gpaError)
expectNotAssignable<PErrorInstance>(gpaError)
expectAssignable<Error>(gpsError)
expectAssignable<ErrorInstance>(gpsError)
expectNotAssignable<PErrorInstance>(gpsError)

type PUnknownInstance = typeof paError

expectType<'UnknownError'>('' as PUnknownInstance['name'])
expectNotAssignable<PUnknownInstance>(new PAnyError('', { cause: psError }))
expectNotAssignable<PUnknownInstance>(PAnyError.normalize(psError))

expectType<'GPSError'>(gpsError.name)
expectAssignable<InstanceType<typeof GPSError>>(gpsError)
expectAssignable<InstanceType<typeof GPAnyError>>(gpsError)
expectAssignable<InstanceType<typeof GPAnyError>>(GPAnyError.normalize(''))
if (exception instanceof GPAnyError) {
  expectAssignable<InstanceType<typeof GPAnyError>>(exception)
}
if (exception instanceof GPSError) {
  expectAssignable<InstanceType<typeof GPSError>>(exception)
}

modernErrors([])
modernErrors([], {})
modernErrors([{ name }], {})
expectError(modernErrors(true))

expectError(AnyError.subclass())
expectError(PAnyError.subclass())
expectError(CCError.subclass())
expectError(AnyError.subclass({}))
expectError(PAnyError.subclass({}))
expectError(CCError.subclass({}))
expectType<never>(AnyError.subclass('AnyError'))
expectType<never>(PAnyError.subclass('AnyError'))
expectType<never>(CCError.subclass('AnyError'))
expectError(AnyError.subclass('Test'))
expectError(PAnyError.subclass('Test'))
expectError(CCError.subclass('Test'))

AnyError.subclass('TestError', {
  custom: class extends AnyError {
    constructor(
      message: ConstructorParameters<typeof AnyError>[0],
      options?: InstanceOptions,
    ) {
      super(message, options)
    }
  },
})
AnyError.subclass('TestError', {
  custom: class extends AnyError {
    constructor(
      message: string,
      options?: ConstructorParameters<typeof AnyError>[1],
    ) {
      super(message, options)
    }
  },
})
AnyError.subclass('TestError', {
  custom: class extends AnyError {
    constructor(message: string, options?: InstanceOptions) {
      super(message, options)
    }
  },
})
PAnyError.subclass('TestError', {
  custom: class extends PAnyError {
    constructor(message: string, options?: InstanceOptions) {
      super(message, options)
    }
  },
})
PAnyError.subclass('TestError', {
  custom: class extends PAnyError {
    constructor(message: string, options?: InstanceOptions<[typeof plugin]>) {
      super(message, options)
    }
  },
})
AnyError.subclass('TestError', {
  custom: class extends AnyError {
    constructor(message: string, options?: object) {
      super(message, options)
    }
  },
})
expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor(options?: object) {
        super('', options)
      }
    },
  }),
)
expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor() {
        super()
      }
    },
  }),
)
expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor(message: string, options?: true) {
        super(message, {})
      }
    },
  }),
)
expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor(
        message: string,
        options?: InstanceOptions & { cause?: true },
      ) {
        super(message, options)
      }
    },
  }),
)
AnyError.subclass('TestError', {
  custom: class extends CError {
    constructor(message: string, options?: InstanceOptions) {
      super(message, options)
    }
  },
})
expectError(
  CError.subclass('TestError', {
    custom: class extends CError {
      constructor(
        message: string,
        options?: InstanceOptions & { cProp?: false },
        extra?: true,
      ) {
        super(message, options, extra)
      }
    },
  }),
)
expectError(
  CError.subclass('TestError', {
    custom: class extends CError {
      constructor(message: string, options?: InstanceOptions, extra?: false) {
        super(message, options, true)
      }
    },
  }),
)
expectError(
  class extends CError {
    constructor() {
      super('', {}, false)
    }
  },
)

const OneError = PAnyError.subclass('OneError', {
  custom: class extends PAnyError {
    property = true as const
  },
})
expectType<true>(new OneError('').property)
const TwoError = PAnyError.subclass('TwoError', {
  custom: class extends PAnyError {
    instanceMethod = (arg: 'arg') => arg
  },
})
expectType<'arg'>(new TwoError('').instanceMethod('arg'))
const ThreeError = PAnyError.subclass('ThreeError', {
  custom: class extends PAnyError {
    static staticMethod(arg: 'arg') {
      return arg
    }
  },
})
expectError(ThreeError.staticMethod('arg'))
const FourError = PAnyError.subclass('FourError', {
  custom: class extends PAnyError {
    static staticMethod = (arg: 'arg') => arg
  },
})
expectError(FourError.staticMethod('arg'))
const PropsError = AnyError.subclass('PropsError', { props: { one: true } })
const ChildPropsError = PropsError.subclass('ChildPropsError', {
  custom: class extends PropsError {
    one = false as const
  },
})
expectType<false>(new ChildPropsError('').one)

// `tsd`'s `expectError()` fails to properly lint those, so they must be
// manually checked by uncommenting those lines.
// expectError(
//   class extends PAnyError {
//     property = true as boolean
//   },
// )
// expectError(
//   class extends PAnyError {
//     instanceMethod = (arg: string) => arg
//   },
// )
// expectError(
//   class extends PAnyError {
//     static staticMethod = (arg: string) => arg
//   },
// )
// expectError(
//   class extends AnyError {
//     message = true
//   },
// )
// expectError(
//   class extends PropsError {
//     one = ''
//   },
// )

const MessageMethodAnyError = modernErrors([
  { name, instanceMethods: { message: () => {} } },
])
expectType<Error['message']>(
  new MessageMethodAnyError('', { cause: '' }).message,
)
const CorePropsAnyError = modernErrors([
  {
    name,
    properties: () =>
      ({
        name: 'test',
        message: 'test',
        stack: 'test',
        cause: 'test',
        errors: ['test'],
        two: 'test',
        three: 'test',
      } as const),
    instanceMethods: { one: () => {}, two: () => {} },
  },
])
const CorePropsError = CorePropsAnyError.subclass('CorePropsError')
const corePropsError = new CorePropsError('')
expectType<'test'>(corePropsError.message)
expectType<'test'>(corePropsError.stack)
expectType<'CorePropsError'>(corePropsError.name)
expectType<Error['cause']>(corePropsError.cause)
expectError(corePropsError.errors)
expectNotAssignable<string>(corePropsError.two)
expectNotAssignable<string>(
  new CorePropsError('', { props: { one: '' as const } }).one,
)
expectType<never>(new CorePropsError('', { props: { three: '' as const } }))
expectType<'test'>(
  new CorePropsError('', { props: { three: 'test' as const } }).three,
)
expectType<'test'>(
  new SError('', { props: { message: 'test' as const } }).message,
)
expectType<never>(new SError('', { props: { message: true as const } }))
expectType<'test'>(new SError('', { props: { stack: 'test' as const } }).stack)
expectType<never>(new SError('', { props: { stack: true as const } }))
expectType<'SError'>(new SError('', { props: { name: 'test' as const } }).name)
expectType<Error['cause']>(
  new SError('', { props: { cause: 'test' as const } }).cause,
)
expectError(new SError('', { props: { errors: ['test'] } }).errors)
const DuplicateProppertiesAnyError = modernErrors([
  { name: 'one' as const, properties: () => ({ prop: 'one' as const }) },
  { name: 'two' as const, properties: () => ({ prop: 'two' as const }) },
])
expectType<undefined>(new DuplicateProppertiesAnyError('', { cause: '' }).prop)

expectError(new SError('', { cause: new CError('') }).prop)
expectError(new SError('', { cause: new PAnyError('') }).property)
expectError(new SError('', { cause: new PAnyError('') }).instanceMethod)
expectError(
  new SError('', { cause: new SError('', { props: { prop: true } }) }).prop,
)

if (cError instanceof SError) {
  expectType<never>(cError)
}
if (cError instanceof CError) {
  expectAssignable<CInstance>(cError)
}
if (cError instanceof AnyError) {
  expectAssignable<CInstance>(cError)
}
if (cError instanceof Error) {
  expectAssignable<CInstance>(cError)
}
