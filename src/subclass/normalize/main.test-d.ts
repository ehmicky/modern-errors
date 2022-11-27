import { expectType, expectAssignable, expectError } from 'tsd'

import ModernError, { type Plugin } from 'modern-errors'

const ParentError = ModernError.subclass('ParentError', {
  props: { one: true as const },
})
const ChildError = ParentError.subclass('ChildError', {
  props: { two: true as const },
})

type ParentErrorInstance = InstanceType<typeof ParentError>
type ChildErrorInstance = InstanceType<typeof ChildError>

expectAssignable<ParentErrorInstance>(ParentError.normalize(new Error('')))
expectType<ParentErrorInstance>(ParentError.normalize({}))
expectType<ParentErrorInstance>(ParentError.normalize(''))
expectType<ParentErrorInstance>(ParentError.normalize(undefined))
expectAssignable<ParentErrorInstance>(
  ParentError.normalize(undefined, ChildError),
)

expectType<true>(
  ParentError.normalize(new Error('') as Error & { prop: true }).prop,
)
expectType<true>(
  ParentError.normalize(new Error('') as Error & { prop: true }, ChildError)
    .prop,
)
expectType<true>(
  ParentError.normalize(new ModernError('', { props: { prop: true as const } }))
    .prop,
)
expectType<true>(
  ParentError.normalize(new ModernError('', { props: { one: false as const } }))
    .one,
)
expectError(ParentError.normalize({ prop: true }).prop)

expectType<ParentErrorInstance>(ParentError.normalize(new ParentError('')))
expectType<ChildErrorInstance>(ParentError.normalize(new ChildError('')))
expectType<ChildErrorInstance>(
  ParentError.normalize(new ChildError(''), ChildError),
)
expectType<ChildErrorInstance>(ChildError.normalize(new ParentError('')))
expectType<ChildErrorInstance>(
  ChildError.normalize(new ParentError(''), ChildError),
)

const CustomError = ModernError.subclass('CustomError', {
  custom: class extends ModernError {
    prop = true
  },
})
const PropsError = ModernError.subclass('PropsError', {
  props: { one: true as const },
})
type PropsErrorInstance = InstanceType<typeof PropsError>

const customError = new CustomError('')
type CustomInstance = typeof CustomError['prototype']

expectAssignable<CustomInstance>(new ModernError('', { cause: customError }))
expectType<CustomInstance>(ModernError.normalize(customError))

const PluginBaseError = ModernError.subclass('PluginBaseError', {
  plugins: [{ name: 'test' as const }],
})
const PluginCustomError = PluginBaseError.subclass('PluginCustomError', {
  custom: class extends PluginBaseError {
    prop = true
  },
})
const pluginCustomError = new PluginCustomError('')
type PluginCustomInstance = typeof PluginCustomError['prototype']

expectAssignable<PluginCustomInstance>(
  new PluginBaseError('', { cause: pluginCustomError }),
)
expectType<PluginCustomInstance>(PluginBaseError.normalize(pluginCustomError))

const WideError = ModernError.subclass('WideError', { plugins: [{} as Plugin] })

expectAssignable<PluginCustomInstance>(
  new WideError('', { cause: pluginCustomError }),
)
expectType<PluginCustomInstance>(WideError.normalize(pluginCustomError))

const cause = {} as Error & { prop: true }
expectType<true>(new ModernError('', { cause }).prop)
expectType<true>(ModernError.normalize(cause).prop)

ModernError.normalize('', ModernError)
ModernError.normalize('', PropsError)
expectError(ModernError.normalize())
expectError(ModernError.normalize('', true))
expectError(ModernError.normalize('', Error))
expectError(PropsError.normalize('', ModernError))

expectType<PropsErrorInstance[]>(
  PropsError.normalize(
    new PropsError('', { errors: [''] as readonly string[] }),
  ).errors,
)
const parentAggregateError = new PropsError('', {
  errors: [''] as readonly [''],
})
expectType<[PropsErrorInstance]>(
  PropsError.normalize(parentAggregateError).errors,
)
expectType<[PropsErrorInstance]>(
  PropsError.normalize(
    new PropsError('', {
      errors: [parentAggregateError] as [typeof parentAggregateError],
    }),
  ).errors[0].errors,
)
expectError(PropsError.normalize(new PropsError('')).errors)
