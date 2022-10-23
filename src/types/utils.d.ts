export type Intersect<
  Source extends object,
  Target extends unknown,
  OmittedKeys extends PropertyKey,
> = keyof Target extends OmittedKeys
  ? Source
  : Source & Omit<Target, OmittedKeys>
