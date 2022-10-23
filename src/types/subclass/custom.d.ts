import type { Plugins } from '../plugins/shape.js'
import type { ErrorConstructor } from './parent.js'

export type CustomAttributes = object

type OmitCustomName<CustomAttributesArg extends CustomAttributes> =
  'name' extends keyof CustomAttributesArg
    ? Omit<CustomAttributesArg, 'name'>
    : CustomAttributesArg

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

export type AddCustomAttributes<
  PluginsArg extends Plugins,
  ParentAnyErrorClass extends ErrorConstructor<PluginsArg>,
  ParentErrorClass extends ErrorConstructor<PluginsArg>,
> = OmitCustomName<
  CustomInstanceAttributes<
    InstanceType<ParentAnyErrorClass>,
    InstanceType<ParentErrorClass>
  >
>
