import { expectType } from 'tsd'

import ModernError, { type Info, type Plugin } from 'modern-errors'

const name = 'test' as const
const emptyPlugin = { name }
const barePlugin = {
  ...emptyPlugin,
  staticMethods: {
    staticMethod: (info: Info['staticMethods'], arg: '') => arg,
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

expectType<''>(BareBaseError.staticMethod(''))
expectType<''>(FullBaseError.staticMethod(''))
expectType<''>(MixBaseError.staticMethod(''))
expectType<''>(BareChildError.staticMethod(''))
expectType<''>(FullChildError.staticMethod(''))
expectType<''>(MixChildError.staticMethod(''))
// @ts-expect-error
BareBaseError.staticMethod(true)
// @ts-expect-error
FullBaseError.staticMethod(true)
// @ts-expect-error
MixBaseError.staticMethod(true)
// @ts-expect-error
BareChildError.staticMethod(true)
// @ts-expect-error
FullChildError.staticMethod(true)
// @ts-expect-error
MixChildError.staticMethod(true)

expectType<''>(FullBaseError.staticMethod('', true))
expectType<''>(FullChildError.staticMethod('', true))
// @ts-expect-error
BareBaseError.staticMethod('', true)
// @ts-expect-error
BareBaseError.staticMethod('', undefined)
// @ts-expect-error
FullBaseError.staticMethod('', false)
// @ts-expect-error
FullBaseError.staticMethod('', undefined)
// @ts-expect-error
FullBaseError.staticMethod('', true, undefined)
// @ts-expect-error
MixBaseError.staticMethod('', false)
// @ts-expect-error
MixBaseError.staticMethod('', undefined)
// @ts-expect-error
MixBaseError.staticMethod('', true, undefined)
// @ts-expect-error
BareChildError.staticMethod('', true)
// @ts-expect-error
BareChildError.staticMethod('', undefined)
// @ts-expect-error
FullChildError.staticMethod('', false)
// @ts-expect-error
FullChildError.staticMethod('', undefined)
// @ts-expect-error
FullChildError.staticMethod('', true, undefined)
// @ts-expect-error
MixChildError.staticMethod('', false)
// @ts-expect-error
MixChildError.staticMethod('', undefined)
// @ts-expect-error
MixChildError.staticMethod('', true, undefined)

const info = {} as Info['staticMethods']
// @ts-expect-error
BareBaseError.staticMethod(info)
// @ts-expect-error
FullBaseError.staticMethod(info, '')
// @ts-expect-error
MixBaseError.staticMethod(info, '')
// @ts-expect-error
BareChildError.staticMethod(info)
// @ts-expect-error
FullChildError.staticMethod(info, '')
// @ts-expect-error
MixChildError.staticMethod(info, '')

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
ChildWideError.staticMethod('')
