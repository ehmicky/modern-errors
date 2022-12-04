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
const bareUnknownError = new BareBaseError('')
const fullUnknownError = new FullBaseError('')
const mixUnknownError = new MixBaseError('')
const bareChildError = new BareChildError('')
const fullChildError = new FullChildError('')
const mixChildError = new MixChildError('')

expectType<''>(bareUnknownError.instanceMethod(''))
expectType<''>(bareChildError.instanceMethod(''))
expectType<''>(fullUnknownError.instanceMethod(''))
expectType<''>(fullChildError.instanceMethod(''))
expectType<''>(mixUnknownError.instanceMethod(''))
expectType<''>(mixChildError.instanceMethod(''))
// @ts-expect-error
bareUnknownError.instanceMethod(true)
// @ts-expect-error
bareChildError.instanceMethod(true)
// @ts-expect-error
fullUnknownError.instanceMethod(true)
// @ts-expect-error
fullChildError.instanceMethod(true)
// @ts-expect-error
mixUnknownError.instanceMethod(true)
// @ts-expect-error
mixChildError.instanceMethod(true)

expectType<''>(fullUnknownError.instanceMethod('', true))
expectType<''>(fullChildError.instanceMethod('', true))
expectType<''>(mixUnknownError.instanceMethod('', true))
expectType<''>(mixChildError.instanceMethod('', true))
// @ts-expect-error
bareUnknownError.instanceMethod('', true)
// @ts-expect-error
bareChildError.instanceMethod('', true)
// @ts-expect-error
bareUnknownError.instanceMethod('', undefined)
// @ts-expect-error
bareChildError.instanceMethod('', undefined)
// @ts-expect-error
fullUnknownError.instanceMethod('', false)
// @ts-expect-error
fullChildError.instanceMethod('', false)
// @ts-expect-error
fullUnknownError.instanceMethod('', undefined)
// @ts-expect-error
fullChildError.instanceMethod('', undefined)
// @ts-expect-error
fullUnknownError.instanceMethod('', true, undefined)
// @ts-expect-error
fullChildError.instanceMethod('', true, undefined)
// @ts-expect-error
mixUnknownError.instanceMethod('', false)
// @ts-expect-error
mixChildError.instanceMethod('', false)
// @ts-expect-error
mixUnknownError.instanceMethod('', undefined)
// @ts-expect-error
mixChildError.instanceMethod('', undefined)
// @ts-expect-error
mixUnknownError.instanceMethod('', true, undefined)
// @ts-expect-error
mixChildError.instanceMethod('', true, undefined)

const info = {} as Info['instanceMethods']
// @ts-expect-error
bareUnknownError.instanceMethod(info)
// @ts-expect-error
bareChildError.instanceMethod(info)
// @ts-expect-error
fullUnknownError.instanceMethod(info, '')
// @ts-expect-error
fullChildError.instanceMethod(info, '')
// @ts-expect-error
mixUnknownError.instanceMethod(info, '')
// @ts-expect-error
mixChildError.instanceMethod(info, '')

const WideBaseError = ModernError.subclass('WideBaseError', {
  plugins: [{} as Plugin],
})
const ChildWideError = WideBaseError.subclass('ChildWideError')
const unknownWideError = new WideBaseError('')
const childWideError = new ChildWideError('')

// @ts-expect-error
bareUnknownError.otherMethod()
// @ts-expect-error
bareChildError.otherMethod()
// @ts-expect-error
fullUnknownError.otherMethod()
// @ts-expect-error
fullChildError.otherMethod()
// @ts-expect-error
mixUnknownError.otherMethod()
// @ts-expect-error
mixChildError.otherMethod()
// @ts-expect-error
unknownWideError.otherMethod()
// @ts-expect-error
childWideError.otherMethod()
