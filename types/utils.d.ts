/**
 * Like `Omit<Target, OmittedKeys>` except it reduces empty `{}` for simpler
 * debugging.
 */
export type OmitKeys<
  Source extends unknown,
  OmittedKeys extends PropertyKey,
> = keyof Source extends OmittedKeys ? {} : Omit<Source, OmittedKeys>

/**
 * Forbid `Source` from having keys not present in `Forbidden`
 */
export type NoAdditionalProps<
  Source extends object,
  Forbidden extends object,
> = keyof Source extends keyof Forbidden ? Source : never

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
