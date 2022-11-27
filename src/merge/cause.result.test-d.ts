import { expectType } from 'tsd'

import ModernError from 'modern-errors'

type ModernErrorInstance = InstanceType<typeof ModernError>

expectType<ModernErrorInstance>(
  new ModernError('', { cause: new ModernError('') }),
)
expectType<ModernErrorInstance>(new ModernError('', { cause: new Error('') }))
expectType<ModernErrorInstance>(new ModernError('', { cause: undefined }))
expectType<ModernErrorInstance>(new ModernError('', { cause: '' }))
