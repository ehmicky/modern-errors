import { expectType, expectError } from 'tsd'

import ModernError from 'modern-errors'

const PropsError = ModernError.subclass('PropsError', {
  props: { one: true as const },
})
type PropsErrorInstance = InstanceType<typeof PropsError>

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
