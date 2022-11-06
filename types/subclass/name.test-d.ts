import { expectType } from 'tsd'

import modernErrors from 'modern-errors'

const BaseError = modernErrors()
const ChildError = BaseError.subclass('ChildError')
const PluginBaseError = modernErrors([{ name: 'test' as const }])

expectType<never>(BaseError.subclass('BaseError'))
expectType<never>(ChildError.subclass('BaseError'))
expectType<never>(PluginBaseError.subclass('BaseError'))
