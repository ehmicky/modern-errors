import { CustomError, ErrorName } from 'error-custom-class'

type Class<Instance extends object = object, Args extends any[] = any[]> = {
  new (...args: Args): Instance
  prototype: Instance
}

type MergeObjects<Parent extends object, Child extends object> = Child &
  Omit<Parent, keyof Child>

type MergeClasses<ParentClass extends Class, ChildClass extends Class> = Class<
  MergeObjects<InstanceType<ParentClass>, InstanceType<ChildClass>>,
  ConstructorParameters<ChildClass>
> &
  Omit<ParentClass, keyof ChildClass | keyof Class> &
  Omit<ChildClass, keyof Class>

/**
 * Each `custom` class's parent must be typed as `BaseError`.
 * The type parameter must match the class's name.
 *
 * @example
 * ```js
 * modernErrors({
 *   TestError: { custom: class extends (Error as BaseError<'TestError'>) {} },
 *   UnknownError: {},
 * })
 * ```
 */
export type BaseError<BaseErrorName extends ErrorName> =
  typeof CustomError<BaseErrorName>

/**
 * Class-specific options
 */
type ClassOptions = {
  /**
   * [Custom class](#custom-logic) to add any methods, `constructor` or
   * properties.
   * It must `extend` from
   * [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error).
   *
   * @example
   * ```js
   * const { InputError, UnknownError, AnyError } = modernErrors({
   *   // `*.custom` applies to a single class
   *   InputError: {
   *     custom: class extends Error {
   *       constructor(message, options) {
   *         // Modifying `message` or `options` should be done before `super()`
   *         message += message.endsWith('.') ? '' : '.'
   *
   *         // `super()` should be called with both arguments
   *         super(message, options)
   *
   *         // `name` is automatically added, so this is not necessary
   *         // this.name = 'InputError'
   *       }
   *     },
   *   },
   *
   *   // `AnyError.custom` applies to all classes
   *   AnyError: {
   *     custom: class extends Error {
   *       isUserInput() {
   *         return this.message.includes('user')
   *       }
   *     },
   *   },
   *
   *   UnknownError: {},
   * })
   *
   * const error = new InputError('Wrong user name')
   * console.log(error.message) // 'Wrong user name.'
   * console.log(error.isUserInput()) // true
   * ```
   */
  readonly custom?: Class<Error>
}

/**
 * Error classes definitions. Object where:
 *   - Each key is the class name, e.g. `InputError`.
 *     One of the classes must be named `UnknownError`.
 *   - Each value is an object with the class options.
 */
type Definitions = {
  readonly UnknownError: ClassOptions
  readonly [ErrorNameArg: ErrorName]: ClassOptions
}

type ClassNames<DefinitionsArg extends Definitions> = Exclude<
  keyof DefinitionsArg & ErrorName,
  'AnyError'
>

/**
 * Error class returned by `modernErrors()`
 */
type ReturnErrorClass<
  DefinitionsArg extends Definitions,
  ErrorNameArg extends ErrorName,
  CustomOption = DefinitionsArg[ErrorNameArg]['custom'],
> = CustomOption extends Class<Error>
  ? MergeClasses<BaseError<ErrorNameArg>, CustomOption>
  : BaseError<ErrorNameArg>

/**
 * All error classes returned by `modernErrors()`
 */
type ReturnErrorClasses<DefinitionsArg extends Definitions> = {
  [ErrorNameArg in ClassNames<DefinitionsArg>]: ReturnErrorClass<
    DefinitionsArg,
    ErrorNameArg
  >
}

type AnyKnownClass<
  DefinitionsArg extends Definitions,
  ErrorNameArg extends ErrorName = ClassNames<DefinitionsArg>,
> = ErrorNameArg extends any
  ? ReturnErrorClass<DefinitionsArg, ErrorNameArg>
  : never

/**
 * Base class of the `ErrorClasses` passed to `modernErrors()`.
 *
 * @example
 * ```js
 * try {
 *   throw new AuthError('Could not authenticate.')
 * } catch (cause) {
 *   throw new AnyError('Could not read the file.', { cause })
 *   // Still an AuthError
 * }
 * ```
 */
type AnyError<DefinitionsArg extends Definitions> =
  AnyKnownClass<DefinitionsArg> & {
    /**
     * Normalizes invalid errors and assigns the `UnknownError` class to
     * _unknown_ errors. This should wrap each main function.
     *
     * @example
     * ```js
     * export const main = async function (filePath) {
     *   try {
     *     return await readContents(filePath)
     *   } catch (error) {
     *     throw AnyError.normalize(error)
     *   }
     * }
     * ```
     */
    normalize(error: unknown): InstanceType<AnyKnownClass<DefinitionsArg>>
  }

/**
 * Creates and returns error classes.
 * Also returns their base class `AnyError`.
 *
 * @example
 * ```js
 * export const {
 *   // Custom error classes
 *   InputError,
 *   AuthError,
 *   DatabaseError,
 *   UnknownError,
 *   // Base error class
 *   AnyError,
 * } = modernErrors({
 *   // Custom error classes definitions
 *   InputError: {},
 *   AuthError: {},
 *   DatabaseError: {},
 *   UnknownError: {},
 * })
 * ```
 */
export default function modernErrors<DefinitionsArg extends Definitions>(
  definitions: DefinitionsArg,
): ReturnErrorClasses<DefinitionsArg> & { AnyError: AnyError<DefinitionsArg> }
