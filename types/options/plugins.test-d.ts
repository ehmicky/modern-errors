import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import modernErrors, {
  Plugin,
  ClassOptions,
  InstanceOptions,
  MethodOptions,
} from 'modern-errors'

const barePlugin = { name: 'test' as const }
const fullPlugin = { ...barePlugin, getOptions: (input: true) => input }

const BaseError = modernErrors([fullPlugin])
const ChildError = BaseError.subclass('ChildError')

expectError(modernErrors([barePlugin], { test: true }))

modernErrors([fullPlugin], { test: true })
BaseError.subclass('TestError', { test: true })
new BaseError('', { test: true })
new ChildError('', { test: true })
expectAssignable<ClassOptions<[typeof fullPlugin]>>({ test: true })
expectAssignable<InstanceOptions<[typeof fullPlugin]>>({ test: true })
expectAssignable<MethodOptions<typeof fullPlugin>>(true)

expectError(modernErrors([fullPlugin], { test: 'true' }))
expectError(BaseError.subclass('TestError', { test: 'true' }))
expectError(new BaseError('', { test: 'true' }))
expectError(new ChildError('', { test: 'true' }))
expectNotAssignable<ClassOptions<[typeof fullPlugin]>>({ test: 'true' })
expectNotAssignable<InstanceOptions<[typeof fullPlugin]>>({ test: 'true' })
expectNotAssignable<MethodOptions<typeof fullPlugin>>('true')

expectError(modernErrors([], { other: true }))
expectError(modernErrors([fullPlugin as Plugin], { other: true }))
expectError(
  modernErrors([{ ...fullPlugin, name: '' as string }], { other: true }),
)
expectError(new BaseError('', { cause: '', other: true }))
expectError(new ChildError('', { other: true }))
expectError(new ChildError('', { cause: '', other: true }))
expectNotAssignable<ClassOptions>({ other: true })
expectNotAssignable<InstanceOptions>({ other: true })

expectAssignable<InstanceOptions>({})
expectAssignable<ClassOptions>({})
expectAssignable<MethodOptions<typeof barePlugin>>({} as never)

expectNotAssignable<InstanceOptions>(true)
expectNotAssignable<ClassOptions>(true)
expectNotAssignable<MethodOptions<typeof barePlugin>>(true)
