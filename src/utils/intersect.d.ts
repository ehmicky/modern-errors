/**
 * Turn `T | T2 | ...` into `T & T2 & ...`
 */
export type UnionToIntersection<T> = (
  T extends unknown ? (arg: T) => unknown : never
) extends (arg: infer U) => unknown
  ? U
  : never
