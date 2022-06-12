import modernErrors from 'modern-errors'
import { expectType, expectError } from 'tsd'

expectType<{}>(modernErrors())
modernErrors({})
modernErrors({ bugsUrl: '' })
modernErrors({ bugsUrl: new URL('') })
modernErrors({ onCreate: (_: Error, __: { anyProp?: boolean }) => {} })

expectError(modernErrors(true))
expectError(modernErrors({ bugsUrl: true }))
expectError(modernErrors({ onCreate: true }))
expectError(modernErrors({ onCreate: (_: boolean) => {} }))
