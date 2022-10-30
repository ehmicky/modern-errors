/**
 * Non-static properties defined by the `custom` option
 */
export type CustomAttributes = object

/**
 * Non-static properties defined by the `custom` option, excluded the ones
 * already defined by the parent or by `Error`
 */
export type CustomInstanceAttributes<
  Parent extends CustomAttributes,
  Child extends unknown,
> = Child extends Parent
  ? {
      [ChildKey in keyof Child as ChildKey extends keyof Parent
        ? Parent[ChildKey] extends Child[ChildKey]
          ? never
          : ChildKey
        : ChildKey]: Child[ChildKey]
    }
  : {}
