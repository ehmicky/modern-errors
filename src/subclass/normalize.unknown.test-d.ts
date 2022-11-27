import { expectType, expectAssignable, expectError } from 'tsd'

import ModernError from 'modern-errors'

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
