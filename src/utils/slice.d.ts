/**
 * Omit the first item of a tuple
 */
export type SliceFirst<Tuple extends readonly unknown[]> =
  Tuple extends readonly [unknown, ...infer Rest extends readonly unknown[]]
    ? Rest
    : readonly never[]
