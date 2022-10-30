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

const SError = AnyError.subclass('SError')
expectType<true>(new SError('', { props: { one: true as const } }).one)
expectAssignable<{ one: true; three: true }>(
  new SError('', {
    cause: new SError('', {
      props: { two: true as const, three: false as const },
    }),
    props: { one: true as const, three: true as const },
  }),
)

const QError = AnyError.subclass('QError', {
  props: { one: true as const, three: false as const },
})
expectType<true>(new QError('').one)
expectAssignable<{ one: true; two: true; three: true }>(
  new QError('', { props: { two: true as const, three: true as const } }),
)

const SQError = QError.subclass('SQError')
expectType<true>(new SQError('').one)

const MQError = QError.subclass('MQError', {
  props: { two: true as const, three: true as const },
})
expectAssignable<{ one: true; two: true; three: true }>(new MQError(''))

const QSError = SError.subclass('QSError', {
  props: { one: true as const, three: false as const },
})
expectType<true>(new QSError('').one)
expectAssignable<{ one: true; two: true; three: true }>(
  new QSError('', { props: { two: true as const, three: true as const } }),
)

const QAnyError = modernErrors([], {
  props: { one: true as const, three: false as const },
})
expectType<true>(new QAnyError('', { cause: '' }).one)
expectAssignable<{ one: true; two: true; three: true }>(
  new QAnyError('', {
    cause: '',
    props: { two: true as const, three: true as const },
  }),
)

const SQAError = QAnyError.subclass('SQAError')
expectType<true>(new SQAError('').one)

const SSQAError = SQAError.subclass('SSQAError')
expectType<true>(new SSQAError('').one)

const MQAError = QAnyError.subclass('MQAError', {
  props: { two: true as const, three: true as const },
})
expectAssignable<{ one: true; two: true; three: true }>(new MQAError(''))

const MSQAError = SQAError.subclass('MSQAError', {
  props: { two: true as const, three: true as const },
})
expectAssignable<{ one: true; two: true; three: true }>(new MSQAError(''))
