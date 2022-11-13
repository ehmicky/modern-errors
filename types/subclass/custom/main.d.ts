/**
 * Non-static properties defined by the `custom` option
 */
export type CustomAttributes = object

/**
 * Names of non-static properties defined by the `custom` option, excluded the
 * ones already defined by the parent or by `Error`
 */
type CustomInstanceKeys<
  Parent extends CustomAttributes,
  Child extends Parent,
  ChildKey extends keyof Child,
> = ChildKey extends keyof Parent
  ? Parent[ChildKey] extends Child[ChildKey]
    ? never
    : ChildKey
  : ChildKey

/**
 * Non-static properties defined by the `custom` option, excluded the ones
 * already defined by the parent or by `Error`
 */
export type CustomInstanceAttributes<
  Parent extends CustomAttributes,
  Child extends unknown,
> = Child extends Parent
  ? {
      [ChildKey in CustomInstanceKeys<
        Parent,
        Child,
        keyof Child
      >]: Child[ChildKey]
    }
  : {}
