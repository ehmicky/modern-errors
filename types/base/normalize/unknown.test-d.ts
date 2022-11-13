import { expectType } from 'tsd'

import ModernError from 'modern-errors'

type ModernErrorInstance = InstanceType<typeof ModernError>

expectType<ModernErrorInstance>(
  new ModernError('', { cause: new ModernError('') }),
)
expectType<ModernErrorInstance>(ModernError.normalize(new ModernError('')))
expectType<ModernErrorInstance>(new ModernError('', { cause: new Error('') }))
expectType<ModernErrorInstance>(ModernError.normalize(new Error('')))
expectType<ModernErrorInstance>(new ModernError('', { cause: undefined }))
expectType<ModernErrorInstance>(ModernError.normalize(undefined))
expectType<ModernErrorInstance>(new ModernError('', { cause: '' }))
expectType<ModernErrorInstance>(ModernError.normalize(''))
