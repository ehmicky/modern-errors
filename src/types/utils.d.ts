export type Intersect<
  Source extends object,
  Target extends object,
  OmittedKeys extends PropertyKey,
> = keyof Target extends OmittedKeys
  ? Source
  : Source & Omit<Target, OmittedKeys>

export type NoAdditionalProps<
  T extends object,
  U extends object,
> = keyof T extends keyof U ? T : never

export type UnionToIntersection<T> = (
  T extends any ? (arg: T) => any : never
) extends (arg: infer U) => any
  ? U
  : never

export type SliceFirst<Tuple extends unknown[]> = Tuple extends [
  unknown,
  ...infer Rest,
]
  ? Rest
  : []
