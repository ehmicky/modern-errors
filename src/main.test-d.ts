import modernErrors from 'modern-errors'
import { expectType, expectError } from 'tsd'

expectType<{}>(modernErrors([]))
modernErrors(undefined)
modernErrors('test')

expectError(modernErrors())
expectError(modernErrors(new Error('test'), {}))
