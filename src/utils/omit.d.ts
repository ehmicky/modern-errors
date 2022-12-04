/**
 * Like `Omit<Source, OmittedKeys>` except it reduces empty `{}` for simpler
 * debugging.
 */
export type OmitKeys<
  Source,
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
