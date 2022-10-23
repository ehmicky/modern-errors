import type { ErrorName } from 'error-custom-class'

interface CommonInfo {
  error: ErrorInstance
  readonly options: never
  readonly showStack: boolean
  readonly AnyError: AnyErrorClass<Plugins>
  readonly ErrorClasses: {
    AnyError: never
    UnknownError: ErrorClass
    [name: ErrorName]: ErrorClass
  }
  readonly errorInfo: (error: unknown) => Info['errorInfo']
}

export interface Info {
  readonly properties: CommonInfo
  readonly instanceMethods: CommonInfo
  readonly staticMethods: Omit<CommonInfo, 'error' | 'showStack'>
  readonly errorInfo: Omit<
    CommonInfo,
    'AnyError' | 'ErrorClasses' | 'errorInfo'
  >
}

type GetOptions = (input: never, full: boolean) => unknown
type IsOptions = (input: unknown) => boolean
type InstanceMethod = (
  info: Info['instanceMethods'],
  ...args: never[]
) => unknown
interface InstanceMethods {
  readonly [MethodName: string]: InstanceMethod
}
type StaticMethod = (info: Info['staticMethods'], ...args: never[]) => unknown
interface StaticMethods {
  readonly [MethodName: string]: StaticMethod
}
type GetProperties = (info: Info['properties']) => {
  [PropName: string]: unknown
}

/**
 * Plugins extend `modern-errors` features.
 *
 * @example
 * ```js
 * import modernErrorsBugs from 'modern-errors-bugs'
 * import modernErrorsSerialize from 'modern-errors-serialize'
 *
 * export const AnyError = modernErrors([modernErrorsBugs, modernErrorsSerialize])
 * ```
 */
export interface Plugin {
  readonly name: string
  readonly getOptions?: GetOptions
  readonly isOptions?: IsOptions
  readonly instanceMethods?: InstanceMethods
  readonly staticMethods?: StaticMethods
  readonly properties?: GetProperties
}

type Plugins = readonly Plugin[]

type UnionToIntersection<T> = (
  T extends any ? (arg: T) => any : never
) extends (arg: infer U) => any
  ? U
  : never

type SliceFirst<tuple extends unknown[]> = tuple extends [
  unknown,
  ...infer Rest,
]
  ? Rest
  : []

type ErrorInstanceMethod<
  InstanceMethodArg extends InstanceMethod,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = (
  ...args: readonly [
    ...SliceFirst<Parameters<InstanceMethodArg>>,
    MethodOptionsArg?,
  ]
) => ReturnType<InstanceMethodArg>

type ErrorInstanceMethods<
  InstanceMethodsArg extends InstanceMethods,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = {
  readonly [MethodName in keyof InstanceMethodsArg]: ErrorInstanceMethod<
    InstanceMethodsArg[MethodName],
    MethodOptionsArg
  >
}

type PluginInstanceMethods<PluginArg extends Plugin> = PluginArg extends Plugin
  ? PluginArg['instanceMethods'] extends InstanceMethods
    ? ErrorInstanceMethods<
        PluginArg['instanceMethods'],
        MethodOptions<PluginArg>
      >
    : {}
  : {}

type PluginsInstanceMethods<PluginsArg extends Plugins> = UnionToIntersection<
  PluginInstanceMethods<PluginsArg[number]>
>

type ErrorStaticMethod<
  StaticMethodArg extends StaticMethod,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = (
  ...args: readonly [
    ...SliceFirst<Parameters<StaticMethodArg>>,
    MethodOptionsArg?,
  ]
) => ReturnType<StaticMethodArg>

type ErrorStaticMethods<
  StaticMethodsArg extends StaticMethods,
  MethodOptionsArg extends MethodOptions<Plugin>,
> = {
  readonly [MethodName in keyof StaticMethodsArg]: ErrorStaticMethod<
    StaticMethodsArg[MethodName],
    MethodOptionsArg
  >
}

type PluginStaticMethods<PluginArg extends Plugin> = PluginArg extends Plugin
  ? PluginArg['staticMethods'] extends StaticMethods
    ? ErrorStaticMethods<PluginArg['staticMethods'], MethodOptions<PluginArg>>
    : {}
  : {}

type PluginsStaticMethods<PluginsArg extends Plugins> = UnionToIntersection<
  PluginStaticMethods<PluginsArg[number]>
>

type PluginProperties<PluginArg extends Plugin> = PluginArg extends Plugin
  ? PluginArg['properties'] extends GetProperties
    ? ReturnType<PluginArg['properties']>
    : {}
  : {}

type PluginsProperties<PluginsArg extends Plugins> = UnionToIntersection<
  PluginProperties<PluginsArg[number]>
>

type NoAdditionalProps<
  T extends object,
  U extends object,
> = keyof T extends keyof U ? T : never

type LiteralString<T extends string> = string extends T ? never : T

type ExternalPluginOptions<PluginArg extends Plugin> =
  PluginArg['getOptions'] extends NonNullable<Plugin['getOptions']>
    ? Parameters<PluginArg['getOptions']>[0]
    : never

type ExternalPluginsOptions<PluginsArg extends Plugins> = {
  readonly [PluginArg in PluginsArg[number] as LiteralString<
    PluginArg['name']
  >]?: ExternalPluginOptions<PluginArg>
}

export type MethodOptions<PluginArg extends Plugin> =
  ExternalPluginOptions<PluginArg>

type CustomAttributes = object

type OmitCustomName<CustomAttributesArg extends CustomAttributes> =
  'name' extends keyof CustomAttributesArg
    ? Omit<CustomAttributesArg, 'name'>
    : CustomAttributesArg

type GetCustomAttributes<
  Parent extends CustomAttributes,
  Child extends unknown,
> = Child extends Parent
  ? {
      [ChildKey in keyof Child as ChildKey extends keyof Parent
        ? Parent[ChildKey] extends Child[ChildKey]
          ? never
          : ChildKey
        : ChildKey]: Child[ChildKey]
    }
  : {}

type CustomStaticAttributes<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = SimplifyEmptyObject<
  Omit<ParentErrorClass, keyof SpecificAnyErrorClass<PluginsArg, ErrorProps>>
>

type ErrorProps = object

type MergeProps<
  PropsOne extends ErrorProps,
  PropsTwo extends ErrorProps,
> = keyof PropsTwo extends never
  ? PropsOne
  : Omit<PropsOne, keyof PropsTwo> & PropsTwo

type GetPropsOption<CorePluginsOptionsArg extends CorePluginsOptions> =
  CorePluginsOptionsArg['props'] extends ErrorProps
    ? CorePluginsOptionsArg['props']
    : {}

type MergeErrorProps<
  Props extends ErrorProps,
  CorePluginsOptionsArg extends CorePluginsOptions,
> = MergeProps<Props, GetPropsOption<CorePluginsOptionsArg>>

interface CorePluginsOptions {
  readonly props?: ErrorProps
}

type PluginsOptions<PluginsArg extends Plugins> =
  keyof ExternalPluginsOptions<PluginsArg> extends never
    ? CorePluginsOptions
    : CorePluginsOptions & ExternalPluginsOptions<PluginsArg>

interface MainInstanceOptions {
  readonly cause?: unknown
  readonly errors?: AggregateErrorsOption
}

type SpecificInstanceOptions<PluginsArg extends Plugins> = MainInstanceOptions &
  PluginsOptions<PluginsArg>

export type InstanceOptions<PluginsArg extends Plugins = []> =
  SpecificInstanceOptions<PluginsArg>

type BareConstructor = new (...args: any[]) => any

type NonGenericConstructor<ConstructorArg extends BareConstructor> = {
  new (
    ...args: ConstructorParameters<ConstructorArg>
  ): InstanceType<ConstructorArg>
} & { [Key in keyof ConstructorArg]: ConstructorArg[Key] }

/**
 * Class-specific options
 */
type SpecificClassOptions<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  CustomAttributesArg extends CustomAttributes,
> = {
  /**
   * Custom class to add any methods, `constructor` or properties.
   *
   * @example
   * ```js
   * export const InputError = AnyError.subclass('InputError', {
   *   // The `class` must extend from `AnyError`
   *   custom: class extends AnyError {
   *     // If a `constructor` is defined, its parameters must be (message, options)
   *     // like `AnyError`
   *     constructor(message, options) {
   *       // Modifying `message` or `options` should be done before `super()`
   *       message += message.endsWith('.') ? '' : '.'
   *
   *       // All arguments should be forwarded to `super()`, including any
   *       // custom `options` or additional `constructor` parameters
   *       super(message, options)
   *
   *       // `name` is automatically added, so this is not necessary
   *       // this.name = 'InputError'
   *     }
   *
   *     isUserInput() {
   *       // ...
   *     }
   *   },
   * })
   *
   * const error = new InputError('Wrong user name')
   * console.log(error.message) // 'Wrong user name.'
   * console.log(error.isUserInput())
   * ```
   */
  readonly custom?: NonGenericConstructor<
    ErrorSubclass<
      PluginsArg,
      ErrorPropsArg,
      ParentErrorClass,
      CustomAttributesArg,
      ErrorName
    >
  >
} & PluginsOptions<PluginsArg>

export type ClassOptions<PluginsArg extends Plugins = []> =
  SpecificClassOptions<
    PluginsArg,
    ErrorProps,
    ErrorConstructor<PluginsArg>,
    CustomAttributes
  >

type SpecificGlobalOptions<PluginsArg extends Plugins> =
  PluginsOptions<PluginsArg>

export type GlobalOptions<PluginsArg extends Plugins = []> =
  SpecificGlobalOptions<PluginsArg>

type SpecificErrorName<ErrorNameArg extends ErrorName> = { name: ErrorNameArg }

type DefinedAggregateErrorsOption = unknown[]
type AggregateErrorsOption = DefinedAggregateErrorsOption | undefined

type GetAggregateErrorsOption<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  InstanceOptionsArg extends SpecificInstanceOptions<PluginsArg>,
> = ConcatAggregateErrors<
  PluginsArg,
  InstanceOptionsArg
> extends DefinedAggregateErrorsOption
  ? NormalizeAggregateErrors<
      PluginsArg,
      ErrorPropsArg,
      ConcatAggregateErrors<PluginsArg, InstanceOptionsArg>
    >
  : ConcatAggregateErrors<PluginsArg, InstanceOptionsArg>

type ConcatAggregateErrors<
  PluginsArg extends Plugins,
  InstanceOptionsArg extends SpecificInstanceOptions<PluginsArg>,
> = InstanceOptionsArg['errors'] extends DefinedAggregateErrorsOption
  ? 'errors' extends keyof InstanceOptionsArg['cause']
    ? InstanceOptionsArg['cause']['errors'] extends DefinedAggregateErrorsOption
      ? [
          ...InstanceOptionsArg['cause']['errors'],
          ...InstanceOptionsArg['errors'],
        ]
      : InstanceOptionsArg['errors']
    : InstanceOptionsArg['errors']
  : 'errors' extends keyof InstanceOptionsArg['cause']
  ? InstanceOptionsArg['cause']['errors'] extends DefinedAggregateErrorsOption
    ? InstanceOptionsArg['cause']['errors']
    : undefined
  : undefined

type NormalizeAggregateErrors<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  AggregateErrorsArg extends DefinedAggregateErrorsOption,
> = AggregateErrorsArg extends [infer AggregateErrorArg, ...infer Rest]
  ? [
      NormalizeError<PluginsArg, ErrorPropsArg, AggregateErrorArg>,
      ...NormalizeAggregateErrors<PluginsArg, ErrorPropsArg, Rest>,
    ]
  : AggregateErrorsArg

type AggregateErrorsProp<AggregateErrorsArg extends AggregateErrorsOption> =
  AggregateErrorsArg extends DefinedAggregateErrorsOption
    ? { errors: AggregateErrorsArg }
    : {}

type CoreErrorProps = keyof Error | 'errors'
type ConstErrorProps = Exclude<CoreErrorProps, 'message' | 'stack'>

type SimplifyEmptyObject<T extends unknown> = keyof T extends never ? {} : T

type BaseError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  CustomAttributesArg extends CustomAttributes,
  ErrorNameArg extends ErrorName,
  AggregateErrorsArg extends AggregateErrorsOption,
> = Error &
  SpecificErrorName<ErrorNameArg> &
  SimplifyEmptyObject<AggregateErrorsProp<AggregateErrorsArg>> &
  SimplifyEmptyObject<CustomAttributesArg> &
  SimplifyEmptyObject<
    Omit<PluginsInstanceMethods<PluginsArg>, CoreErrorProps>
  > &
  SimplifyEmptyObject<
    Omit<
      PluginsProperties<PluginsArg>,
      ConstErrorProps | keyof PluginsInstanceMethods<PluginsArg>
    >
  > &
  SimplifyEmptyObject<
    Omit<
      ErrorPropsArg,
      ConstErrorProps | keyof PluginsInstanceMethods<PluginsArg>
    >
  >

export type ErrorInstance<PluginsArg extends Plugins = []> = BaseError<
  PluginsArg,
  ErrorProps,
  CustomAttributes,
  ErrorName,
  AggregateErrorsOption
>

type ErrorConstructor<PluginsArg extends Plugins> = new (
  message: string,
  options?: SpecificInstanceOptions<PluginsArg>,
  ...extra: any[]
) => ErrorInstance<PluginsArg>

type ParentInstanceOptions<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = ConstructorParameters<ParentErrorClass>[1] &
  SpecificInstanceOptions<PluginsArg>

type ParentExtra<
  PluginsArg extends Plugins,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = ConstructorParameters<ParentErrorClass> extends [
  unknown,
  unknown?,
  ...infer Extra,
]
  ? Extra
  : never

type ErrorSubclass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  CustomAttributesArg extends CustomAttributes,
  ErrorNameArg extends ErrorName,
> = {
  new <
    InstanceOptionsArg extends ParentInstanceOptions<
      PluginsArg,
      ParentErrorClass
    > = {},
  >(
    message: string,
    options?: NoAdditionalProps<
      InstanceOptionsArg,
      ParentInstanceOptions<PluginsArg, ParentErrorClass>
    >,
    ...extra: ParentExtra<PluginsArg, ParentErrorClass>
  ): BaseError<
    PluginsArg,
    MergeErrorProps<ErrorPropsArg, InstanceOptionsArg>,
    CustomAttributesArg,
    ErrorNameArg,
    GetAggregateErrorsOption<PluginsArg, ErrorPropsArg, InstanceOptionsArg>
  >
  readonly prototype: BaseError<
    PluginsArg,
    ErrorPropsArg,
    CustomAttributesArg,
    ErrorNameArg,
    AggregateErrorsOption
  >
  readonly subclass: CreateSubclass<
    PluginsArg,
    ErrorPropsArg,
    ParentErrorClass,
    CustomAttributesArg
  >
} & CustomStaticAttributes<PluginsArg, ParentErrorClass>

export type ErrorClass<PluginsArg extends Plugins = []> = ErrorSubclass<
  PluginsArg,
  ErrorProps,
  ErrorConstructor<PluginsArg>,
  CustomAttributes,
  ErrorName
>

type CreateSubclass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
  CustomAttributesArg extends CustomAttributes,
> = <
  ErrorNameArg extends ErrorName,
  ClassOptionsArg extends SpecificClassOptions<
    PluginsArg,
    ErrorPropsArg,
    ParentErrorClass,
    CustomAttributesArg
  >,
>(
  errorName: ErrorNameArg,
  options?: ClassOptionsArg,
) => ClassOptionsArg['custom'] extends ErrorConstructor<PluginsArg>
  ? ErrorSubclass<
      PluginsArg,
      MergeErrorProps<ErrorPropsArg, ClassOptionsArg>,
      ClassOptionsArg['custom'],
      OmitCustomName<
        GetCustomAttributes<
          InstanceType<SpecificAnyErrorClass<PluginsArg, ErrorPropsArg>>,
          InstanceType<ClassOptionsArg['custom']>
        >
      >,
      ErrorNameArg
    >
  : ErrorSubclass<
      PluginsArg,
      MergeErrorProps<ErrorPropsArg, ClassOptionsArg>,
      ParentErrorClass,
      CustomAttributesArg,
      ErrorNameArg
    >

type NormalizedErrorName<ErrorArg extends unknown> = unknown extends ErrorArg
  ? ErrorName
  : ErrorArg extends ErrorInstance
  ? ErrorArg['name']
  : 'UnknownError'

type AnyErrorInstance<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
  SpecificInstanceOptionsArg extends SpecificInstanceOptions<PluginsArg>,
> = BaseError<
  PluginsArg,
  ErrorPropsArg,
  GetCustomAttributes<Error, ErrorArg>,
  NormalizedErrorName<ErrorArg>,
  GetAggregateErrorsOption<
    PluginsArg,
    ErrorPropsArg,
    SpecificInstanceOptionsArg
  >
>

type NormalizeError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
> = AnyErrorInstance<
  PluginsArg,
  ErrorPropsArg,
  ErrorArg,
  SpecificInstanceOptions<PluginsArg>
>

type AnyNormalize<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
> = ErrorArg extends NormalizeError<PluginsArg, ErrorPropsArg, ErrorArg>
  ? ErrorArg
  : NormalizeError<PluginsArg, ErrorPropsArg, ErrorArg>

/**
 * Base error class.
 *
 * @example
 * ```js
 * try {
 *   throw new AuthError('...')
 * } catch (cause) {
 *   // Still an AuthError
 *   throw new AnyError('...', { cause })
 * }
 * ```
 */
type SpecificAnyErrorClass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
> = {
  new <InstanceOptionsArg extends SpecificInstanceOptions<PluginsArg> = {}>(
    message: string,
    options?: NoAdditionalProps<
      InstanceOptionsArg,
      SpecificInstanceOptions<PluginsArg>
    >,
    ...extra: any[]
  ): AnyErrorInstance<
    PluginsArg,
    MergeErrorProps<ErrorPropsArg, InstanceOptionsArg>,
    InstanceOptionsArg['cause'],
    InstanceOptionsArg
  >
  readonly prototype: BaseError<
    PluginsArg,
    ErrorPropsArg,
    {},
    ErrorName,
    AggregateErrorsOption
  >

  /**
   * Creates and returns an error subclass.
   * The first one must be named `UnknownError`.
   * Subclasses can also call `ErrorClass.subclass()` themselves.
   *
   * @example
   * ```js
   * export const InputError = AnyError.subclass('InputError', options)
   * ```
   */
  readonly subclass: CreateSubclass<
    PluginsArg,
    ErrorPropsArg,
    SpecificAnyErrorClass<PluginsArg, ErrorPropsArg>,
    {}
  >

  /**
   * Normalizes invalid errors and assigns the `UnknownError` class to
   * _unknown_ errors.
   *
   * @example
   * ```js
   * try {
   *   throw 'Missing file path.'
   * } catch (error) {
   *   // Normalized from a string to an `Error` instance
   *   throw AnyError.normalize(error)
   * }
   * ```
   */
  normalize<ErrorArg extends unknown>(
    error: ErrorArg,
  ): AnyNormalize<PluginsArg, ErrorPropsArg, ErrorArg>
} & PluginsStaticMethods<PluginsArg>

export type AnyErrorClass<PluginsArg extends Plugins = []> =
  SpecificAnyErrorClass<PluginsArg, ErrorProps>

// Known limitations of current types:
//  - Plugin methods cannot be generic
//  - If two `plugin.properties()` (or `props`) return the same property, they
//    are intersected using `&`, instead of the second one overriding the first.
//    Therefore, the type of `plugin.properties()` that are not unique should
//    currently be wide to avoid the `&` intersection resulting in `undefined`.
//  - Type narrowing with `instanceof` does not work with:
//     - Any error class with a `custom` option
//     - `AnyError` if there are any plugins with static methods
//    This is due to the following bug:
//      https://github.com/microsoft/TypeScript/issues/50844
//  - `new AnyError()` should fail if the second argument is not an object with
//    a `cause` property
//  - When a `custom` class overrides a plugin's instance method, it must be
//    set as a class property `methodName = (...) => ...` instead of as a
//    method `methodName(...) { ... }`.
//    This is due to the following bug:
//      https://github.com/microsoft/TypeScript/issues/48125
//  - When a `custom` class overrides a core error property, a plugin's
//    `properties()` or `instanceMethods`, or `props`, it should work even if
//    it is not a subtype of it
//  - When wrapping an error as `cause`:
//     - The following are ignored, which is expected:
//        - Error core properties
//        - Class-specific properties: `custom` methods, instance methods,
//          `plugin.properties()` and `props`
//     - However, the following should be kept and are currently not:
//        - Properties set after instantiation
//        - `custom` instance properties
// Minor limitations:
//  - Plugin static methods should not be allowed to override `Error.*`
//    (e.g. `prepareStackTrace()`)
//  - Plugins should not be allowed to define static or instance methods already
//    defined by other plugins
//  - When wrapping an error from another `modernErrors()` call, the resulting
//    error `name` should be `UnknownError`
/**
 * Creates and returns `AnyError`.
 *
 * @example
 * ```js
 *  // Base error class
 *  export const AnyError = modernErrors()
 *
 *  // The first error class must be named "UnknownError"
 *  export const UnknownError = AnyError.subclass('UnknownError')
 *  export const InputError = AnyError.subclass('InputError')
 *  export const AuthError = AnyError.subclass('AuthError')
 *  export const DatabaseError = AnyError.subclass('DatabaseError')
 * ```
 */
export default function modernErrors<
  PluginsArg extends Plugins = [],
  GlobalOptionsArg extends PluginsOptions<PluginsArg> = {},
>(
  plugins?: PluginsArg,
  options?: GlobalOptionsArg,
): SpecificAnyErrorClass<PluginsArg, GetPropsOption<GlobalOptionsArg>>
