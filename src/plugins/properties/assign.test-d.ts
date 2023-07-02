import ModernError, { type Info, type Plugin } from 'modern-errors'
import { expectType } from 'tsd'

const name = 'test' as const
const emptyPlugin = { name }
const fullPlugin = {
  ...emptyPlugin,
  properties: (info: Info['properties']) => ({ property: true }) as const,
}

const BaseError = ModernError.subclass('BaseError', { plugins: [fullPlugin] })
const MixBaseError = ModernError.subclass('MixBaseError', {
  plugins: [emptyPlugin, fullPlugin] as const,
})
const ChildError = BaseError.subclass('ChildError')
const MixChildError = MixBaseError.subclass('MixChildError')
const unknownError = new BaseError('')
const childError = new ChildError('')
const mixUnknownError = new MixBaseError('')
const mixChildError = new MixChildError('')

expectType<true>(unknownError.property)
expectType<true>(childError.property)
expectType<true>(mixUnknownError.property)
expectType<true>(mixChildError.property)

const WideBaseError = ModernError.subclass('WideBaseError', {
  plugins: [{} as Plugin],
})
const ChildWideError = WideBaseError.subclass('ChildWideError')
const unknownWideError = new WideBaseError('')
const childWideError = new ChildWideError('')

// @ts-expect-error
unknownError.otherProperty
// @ts-expect-error
childError.otherProperty
// @ts-expect-error
mixUnknownError.otherProperty
// @ts-expect-error
mixChildError.otherProperty
// @ts-expect-error
unknownWideError.otherProperty
// @ts-expect-error
childWideError.otherProperty

const exception = {} as unknown

if (exception instanceof ChildError) {
  expectType<true>(exception.property)
}

if (exception instanceof MixChildError) {
  expectType<true>(exception.property)
}
