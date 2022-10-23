export type Intersect<
  Source extends object,
  Target extends unknown,
  OmittedKeys extends PropertyKey,
> = keyof Target extends OmittedKeys
  ? Source
  : Source & Omit<Target, OmittedKeys>

export type NoAdditionalProps<
  T extends object,
  U extends object,
> = keyof T extends keyof U ? T : never
