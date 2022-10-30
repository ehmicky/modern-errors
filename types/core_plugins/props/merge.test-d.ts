import { expectType, expectAssignable } from 'tsd'

import modernErrors from '../../main.js'

const AnyError = modernErrors()

expectType<true>(
  new AnyError('', { cause: '', props: { one: true as const } }).one,
)
expectAssignable<{ one: true; two: true }>(
  new AnyError('', {
    cause: new AnyError('', { cause: '', props: { two: true as const } }),
    props: { one: true as const },
  }),
)

const ChildError = AnyError.subclass('ChildError')
expectType<true>(new ChildError('', { props: { one: true as const } }).one)
expectAssignable<{ one: true; three: true }>(
  new ChildError('', {
    cause: new ChildError('', {
      props: { two: true as const, three: false as const },
    }),
    props: { one: true as const, three: true as const },
  }),
)

const PropsError = AnyError.subclass('PropsError', {
  props: { one: true as const, three: false as const },
})
expectType<true>(new PropsError('').one)
expectAssignable<{ one: true; two: true; three: true }>(
  new PropsError('', { props: { two: true as const, three: true as const } }),
)
const exception = {} as unknown
if (exception instanceof PropsError) {
  expectAssignable<{ one: true; three: false }>(exception)
}

const ChildPropsError = PropsError.subclass('ChildPropsError')
expectType<true>(new ChildPropsError('').one)

const DeepPropsError = PropsError.subclass('DeepPropsError', {
  props: { two: true as const, three: true as const },
})
expectAssignable<{ one: true; two: true; three: true }>(new DeepPropsError(''))

const PropsChildError = ChildError.subclass('PropsChildError', {
  props: { one: true as const, three: false as const },
})
expectType<true>(new PropsChildError('').one)
expectAssignable<{ one: true; two: true; three: true }>(
  new PropsChildError('', {
    props: { two: true as const, three: true as const },
  }),
)

const BoundAnyError = modernErrors([], {
  props: { one: true as const, three: false as const },
})
expectType<true>(new BoundAnyError('', { cause: '' }).one)
expectAssignable<{ one: true; two: true; three: true }>(
  new BoundAnyError('', {
    cause: '',
    props: { two: true as const, three: true as const },
  }),
)

const ChildBoundError = BoundAnyError.subclass('ChildBoundError')
expectType<true>(new ChildBoundError('').one)

const DeepChildBoundError = ChildBoundError.subclass('DeepChildBoundError')
expectType<true>(new DeepChildBoundError('').one)

const PropsBoundError = BoundAnyError.subclass('PropsBoundError', {
  props: { two: true as const, three: true as const },
})
expectAssignable<{ one: true; two: true; three: true }>(new PropsBoundError(''))

const PropsChildBoundError = ChildBoundError.subclass('PropsChildBoundError', {
  props: { two: true as const, three: true as const },
})
expectAssignable<{ one: true; two: true; three: true }>(
  new PropsChildBoundError(''),
)
