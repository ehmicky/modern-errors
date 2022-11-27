import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import ModernError, { ClassOptions, InstanceOptions } from 'modern-errors'

ModernError.subclass('TestError', { props: {} })
new ModernError('', { props: {} })
expectAssignable<ClassOptions>({ props: {} })
expectAssignable<InstanceOptions>({ props: {} })

ModernError.subclass('TestError', { props: { prop: true } })
new ModernError('', { props: { prop: true } })
expectAssignable<ClassOptions>({ props: { prop: true } })
expectAssignable<InstanceOptions>({ props: { prop: true } })

expectError(ModernError.subclass('TestError', { props: true }))
expectError(new ModernError('', { props: true }))
expectNotAssignable<ClassOptions>({ props: true })
expectNotAssignable<InstanceOptions>({ props: true })

expectType<true>(new ModernError('', { props: { one: true as const } }).one)
expectAssignable<{ one: true; two: true }>(
  new ModernError('', {
    cause: new ModernError('', { props: { two: true as const } }),
    props: { one: true as const },
  }),
)

const BaseError = ModernError.subclass('BaseError')
expectType<true>(new BaseError('', { props: { one: true as const } }).one)
expectAssignable<{ one: true; three: true }>(
  new BaseError('', {
    cause: new BaseError('', {
      props: { two: true as const, three: false as const },
    }),
    props: { one: true as const, three: true as const },
  }),
)

const PropsError = ModernError.subclass('PropsError', {
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

const PropsChildError = BaseError.subclass('PropsChildError', {
  props: { one: true as const, three: false as const },
})
expectType<true>(new PropsChildError('').one)
expectAssignable<{ one: true; two: true; three: true }>(
  new PropsChildError('', {
    props: { two: true as const, three: true as const },
  }),
)

const BoundBaseError = ModernError.subclass('BoundBaseError', {
  props: { one: true as const, three: false as const },
})
expectType<true>(new BoundBaseError('').one)
expectAssignable<{ one: true; two: true; three: true }>(
  new BoundBaseError('', {
    props: { two: true as const, three: true as const },
  }),
)

const ChildBoundError = BoundBaseError.subclass('ChildBoundError')
expectType<true>(new ChildBoundError('').one)

const DeepChildBoundError = ChildBoundError.subclass('DeepChildBoundError')
expectType<true>(new DeepChildBoundError('').one)

const PropsBoundError = BoundBaseError.subclass('PropsBoundError', {
  props: { two: true as const, three: true as const },
})
expectAssignable<{ one: true; two: true; three: true }>(new PropsBoundError(''))

const PropsChildBoundError = ChildBoundError.subclass('PropsChildBoundError', {
  props: { two: true as const, three: true as const },
})
expectAssignable<{ one: true; two: true; three: true }>(
  new PropsChildBoundError(''),
)
