/**
 * Turn `T | T2 | ...` into `T & T2 & ...`
 */
export type UnionToIntersection<T> = (
  T extends any ? (arg: T) => any : never
) extends (arg: infer U) => any
  ? U
  : never
