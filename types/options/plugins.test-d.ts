import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import modernErrors, {
  Plugin,
  GlobalOptions,
  ClassOptions,
  InstanceOptions,
  MethodOptions,
} from '../main.js'

const barePlugin = { name: 'test' as const }
const fullPlugin = { ...barePlugin, getOptions: (input: true) => input }

const AnyError = modernErrors([fullPlugin])
const ChildError = AnyError.subclass('ChildError')

expectError(modernErrors([barePlugin], { test: true }))

modernErrors([fullPlugin], { test: true })
AnyError.subclass('TestError', { test: true })
new AnyError('', { test: true })
new ChildError('', { test: true })
expectAssignable<GlobalOptions<[typeof fullPlugin]>>({ test: true })
expectAssignable<ClassOptions<[typeof fullPlugin]>>({ test: true })
expectAssignable<InstanceOptions<[typeof fullPlugin]>>({ test: true })
expectAssignable<MethodOptions<typeof fullPlugin>>(true)

expectError(modernErrors([fullPlugin], { test: 'true' }))
expectError(AnyError.subclass('TestError', { test: 'true' }))
expectError(new AnyError('', { test: 'true' }))
expectError(new ChildError('', { test: 'true' }))
expectNotAssignable<GlobalOptions<[typeof fullPlugin]>>({ test: 'true' })
expectNotAssignable<ClassOptions<[typeof fullPlugin]>>({ test: 'true' })
expectNotAssignable<InstanceOptions<[typeof fullPlugin]>>({ test: 'true' })
expectNotAssignable<MethodOptions<typeof fullPlugin>>('true')

expectError(modernErrors([], { other: true }))
expectError(modernErrors([fullPlugin as Plugin], { other: true }))
expectError(
  modernErrors([{ ...fullPlugin, name: '' as string }], { other: true }),
)
expectError(new AnyError('', { cause: '', other: true }))
expectError(new ChildError('', { other: true }))
expectError(new ChildError('', { cause: '', other: true }))
expectNotAssignable<GlobalOptions>({ other: true })
expectNotAssignable<ClassOptions>({ other: true })
expectNotAssignable<InstanceOptions>({ other: true })

expectAssignable<InstanceOptions>({})
expectAssignable<GlobalOptions>({})
expectAssignable<ClassOptions>({})
expectAssignable<MethodOptions<typeof barePlugin>>({} as never)

expectNotAssignable<InstanceOptions>(true)
expectNotAssignable<GlobalOptions>(true)
expectNotAssignable<ClassOptions>(true)
expectNotAssignable<MethodOptions<typeof barePlugin>>(true)
