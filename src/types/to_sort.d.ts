import type { ErrorName } from 'error-custom-class'
import type {
  Plugins,
  Plugin,
  PluginsInstanceMethods,
  PluginsStaticMethods,
  PluginsProperties,
} from './plugin.js'
import type {
  AggregateErrorsOption,
  GetAggregateErrorsOption,
  AggregateErrorsProp,
} from './aggregate.js'
import type { ErrorProps, MergeErrorProps } from './props.js'

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

/**
 *
 */
export type MethodOptions<PluginArg extends Plugin> =
  ExternalPluginOptions<PluginArg>

type CustomAttributes = object

type OmitCustomName<CustomAttributesArg extends CustomAttributes> =
  'name' extends keyof CustomAttributesArg
    ? Omit<CustomAttributesArg, 'name'>
    : CustomAttributesArg

type CustomInstanceAttributes<
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

type AddCustomAttributes<
  PluginsArg extends Plugins,
  ParentAnyErrorClass extends ErrorConstructor<PluginsArg>,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = OmitCustomName<
  CustomInstanceAttributes<
    InstanceType<ParentAnyErrorClass>,
    InstanceType<ParentErrorClass>
  >
>

type CustomStaticAttributes<
  PluginsArg extends Plugins,
  ParentAnyErrorClass extends ErrorConstructor<PluginsArg>,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = Intersect<{}, ParentErrorClass, keyof ParentAnyErrorClass>

export interface CorePluginsOptions {
  /**
   *
   */
  readonly props?: ErrorProps
}

export type PluginsOptions<PluginsArg extends Plugins> =
  keyof ExternalPluginsOptions<PluginsArg> extends never
    ? CorePluginsOptions
    : CorePluginsOptions & ExternalPluginsOptions<PluginsArg>

interface MainInstanceOptions {
  /**
   *
   */
  readonly cause?: unknown

  /**
   *
   */
  readonly errors?: AggregateErrorsOption
}

export type SpecificInstanceOptions<PluginsArg extends Plugins> =
  MainInstanceOptions & PluginsOptions<PluginsArg>

/**
 *
 */
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

/**
 *
 */
export type ClassOptions<PluginsArg extends Plugins = []> =
  SpecificClassOptions<
    PluginsArg,
    ErrorProps,
    ErrorConstructor<PluginsArg>,
    CustomAttributes
  >

type SpecificGlobalOptions<PluginsArg extends Plugins> =
  PluginsOptions<PluginsArg>

/**
 *
 */
export type GlobalOptions<PluginsArg extends Plugins = []> =
  SpecificGlobalOptions<PluginsArg>

type SpecificErrorName<ErrorNameArg extends ErrorName> = { name: ErrorNameArg }

type CoreErrorProps = keyof Error | 'errors'
type ConstErrorProps = Exclude<CoreErrorProps, 'message' | 'stack'>

type Intersect<
  Source extends object,
  Target extends unknown,
  OmittedKeys extends PropertyKey,
> = keyof Target extends OmittedKeys
  ? Source
  : Source & Omit<Target, OmittedKeys>

type BaseError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  CustomAttributesArg extends CustomAttributes,
  ErrorNameArg extends ErrorName,
  AggregateErrorsArg extends AggregateErrorsOption,
> = Intersect<
  Intersect<
    Intersect<
      Intersect<
        Intersect<
          Error & SpecificErrorName<ErrorNameArg>,
          AggregateErrorsProp<AggregateErrorsArg>,
          never
        >,
        CustomAttributesArg,
        CoreErrorProps
      >,
      PluginsInstanceMethods<PluginsArg>,
      CoreErrorProps
    >,
    PluginsProperties<PluginsArg>,
    ConstErrorProps | keyof PluginsInstanceMethods<PluginsArg>
  >,
  ErrorPropsArg,
  ConstErrorProps | keyof PluginsInstanceMethods<PluginsArg>
>

/**
 *
 */
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
  /**
   *
   */
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
  readonly prototype: InstanceType<
    ErrorSubclass<
      PluginsArg,
      ErrorPropsArg,
      ParentErrorClass,
      CustomAttributesArg,
      ErrorNameArg
    >
  >
  /**
   *
   */
  readonly subclass: CreateSubclass<
    PluginsArg,
    ErrorPropsArg,
    ParentErrorClass,
    CustomAttributesArg
  >
} & CustomStaticAttributes<
  PluginsArg,
  SpecificAnyErrorClass<PluginsArg, ErrorPropsArg>,
  ParentErrorClass
>

/**
 *
 */
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
      AddCustomAttributes<
        PluginsArg,
        SpecificAnyErrorClass<PluginsArg, ErrorPropsArg>,
        ClassOptionsArg['custom']
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
  CustomInstanceAttributes<Error, ErrorArg>,
  NormalizedErrorName<ErrorArg>,
  GetAggregateErrorsOption<
    PluginsArg,
    ErrorPropsArg,
    SpecificInstanceOptionsArg
  >
>

export type NormalizeError<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
  ErrorArg extends unknown,
> = ErrorArg extends ErrorInstance
  ? ErrorArg
  : AnyErrorInstance<
      PluginsArg,
      ErrorPropsArg,
      ErrorArg,
      SpecificInstanceOptions<PluginsArg>
    >

export type SpecificAnyErrorClass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
> = {
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
  readonly prototype: InstanceType<
    SpecificAnyErrorClass<PluginsArg, ErrorPropsArg>
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
  ): NormalizeError<PluginsArg, ErrorPropsArg, ErrorArg>
} & PluginsStaticMethods<PluginsArg>

/**
 *
 */
export type AnyErrorClass<PluginsArg extends Plugins = []> =
  SpecificAnyErrorClass<PluginsArg, ErrorProps>
