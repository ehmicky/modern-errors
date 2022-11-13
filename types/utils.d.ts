/**
 * Like `Omit<Source, OmittedKeys>` except it reduces empty `{}` for simpler
 * debugging.
 */
export type OmitKeys<
  Source extends unknown,
  OmittedKeys extends PropertyKey,
> = keyof Source extends OmittedKeys ? {} : Omit<Source, OmittedKeys>

/**
 * Like `SetProps<LowObject, HighObject>` except it reduces empty `{}` for
 * simpler debugging.
 */
export type SimpleSetProps<
  LowObject extends object,
  HighObject extends object,
> = keyof HighObject extends keyof LowObject
  ? LowObject
  : keyof LowObject extends keyof HighObject
  ? HighObject
  : keyof LowObject & keyof HighObject extends never
  ? LowObject & HighObject
  : SetProps<LowObject, HighObject>

/**
 * Like `LowObject & HighObject` except that if both keys are defined,
 * `HighObject` overrides `LowObject` instead of intersecting to it
 */
export type SetProps<
  LowObject extends object,
  HighObject extends object,
> = Omit<LowObject, keyof HighObject> & HighObject

/**
 * Turn `T | T2 | ...` into `T & T2 & ...`
 */
export type UnionToIntersection<T> = (
  T extends any ? (arg: T) => any : never
) extends (arg: infer U) => any
  ? U
  : never

/**
 * Omit the first item of a tuple
 */
export type SliceFirst<Tuple extends readonly unknown[]> =
  Tuple extends readonly [unknown, ...infer Rest extends readonly unknown[]]
    ? Rest
    : readonly never[]
