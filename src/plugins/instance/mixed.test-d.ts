import ModernError, { type Info, type Plugin } from 'modern-errors'
import { expectType } from 'tsd'

const name = 'test' as const
const emptyPlugin = { name }
const barePlugin = {
  ...emptyPlugin,
  instanceMethods: {
    instanceMethod: (infoArg: Info['instanceMethods'], arg: '') => arg,
  },
}
const fullPlugin = {
  ...barePlugin,
  getOptions: (input: true) => input,
}

const BareBaseError = ModernError.subclass('BareBaseError', {
  plugins: [barePlugin],
})
const FullBaseError = ModernError.subclass('FullBaseError', {
  plugins: [fullPlugin],
})
const MixBaseError = ModernError.subclass('MixBaseError', {
  plugins: [emptyPlugin, fullPlugin] as const,
})
const BareChildError = BareBaseError.subclass('BareChildError')
const FullChildError = FullBaseError.subclass('FullChildError')
const MixChildError = MixBaseError.subclass('MixChildError')

expectType<''>(BareBaseError.instanceMethod(undefined, ''))
expectType<''>(FullBaseError.instanceMethod(undefined, ''))
expectType<''>(MixBaseError.instanceMethod(undefined, ''))
expectType<''>(BareChildError.instanceMethod(undefined, ''))
expectType<''>(FullChildError.instanceMethod(undefined, ''))
expectType<''>(MixChildError.instanceMethod(undefined, ''))

const error = new Error('test')

expectType<''>(BareBaseError.instanceMethod(error, ''))
expectType<''>(FullBaseError.instanceMethod(error, ''))
expectType<''>(MixBaseError.instanceMethod(error, ''))
expectType<''>(BareChildError.instanceMethod(error, ''))
expectType<''>(FullChildError.instanceMethod(error, ''))
expectType<''>(MixChildError.instanceMethod(error, ''))
// @ts-expect-error
BareBaseError.instanceMethod(error, true)
// @ts-expect-error
FullBaseError.instanceMethod(error, true)
// @ts-expect-error
MixBaseError.instanceMethod(error, true)
// @ts-expect-error
BareChildError.instanceMethod(error, true)
// @ts-expect-error
FullChildError.instanceMethod(error, true)
// @ts-expect-error
MixChildError.instanceMethod(error, true)

expectType<''>(FullBaseError.instanceMethod(error, '', true))
expectType<''>(FullChildError.instanceMethod(error, '', true))
// @ts-expect-error
BareBaseError.instanceMethod(error, '', true)
// @ts-expect-error
BareBaseError.instanceMethod(error, '', undefined)
// @ts-expect-error
FullBaseError.instanceMethod(error, '', false)
// @ts-expect-error
FullBaseError.instanceMethod(error, '', undefined)
// @ts-expect-error
FullBaseError.instanceMethod(error, '', true, undefined)
// @ts-expect-error
MixBaseError.instanceMethod(error, '', false)
// @ts-expect-error
MixBaseError.instanceMethod(error, '', undefined)
// @ts-expect-error
MixBaseError.instanceMethod(error, '', true, undefined)
// @ts-expect-error
BareChildError.instanceMethod(error, '', true)
// @ts-expect-error
BareChildError.instanceMethod(error, '', undefined)
// @ts-expect-error
FullChildError.instanceMethod(error, '', false)
// @ts-expect-error
FullChildError.instanceMethod(error, '', undefined)
// @ts-expect-error
FullChildError.instanceMethod(error, '', true, undefined)
// @ts-expect-error
MixChildError.instanceMethod(error, '', false)
// @ts-expect-error
MixChildError.instanceMethod(error, '', undefined)
// @ts-expect-error
MixChildError.instanceMethod(error, '', true, undefined)

const info = {} as Info['instanceMethods']
// @ts-expect-error
BareBaseError.instanceMethod(error, info)
// @ts-expect-error
FullBaseError.instanceMethod(error, info, '')
// @ts-expect-error
MixBaseError.instanceMethod(error, info, '')
// @ts-expect-error
BareChildError.instanceMethod(error, info)
// @ts-expect-error
FullChildError.instanceMethod(error, info, '')
// @ts-expect-error
MixChildError.instanceMethod(error, info, '')

const WideBaseError = ModernError.subclass('WideBaseError', {
  plugins: [{} as Plugin],
})
const ChildWideError = WideBaseError.subclass('ChildWideError')

// @ts-expect-error
BareBaseError.otherMethod()
// @ts-expect-error
FullBaseError.otherMethod()
// @ts-expect-error
MixBaseError.otherMethod()
// @ts-expect-error
WideBaseError.otherMethod()
// @ts-expect-error
BareChildError.otherMethod()
// @ts-expect-error
FullChildError.otherMethod()
// @ts-expect-error
MixChildError.otherMethod()
// @ts-expect-error
ChildWideError.otherMethod()

// @ts-expect-error
ChildWideError.instanceMethod(error, '')
