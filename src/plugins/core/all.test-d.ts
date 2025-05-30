import ModernError, { type ErrorInstance } from 'modern-errors'
import beautifulPlugin from 'modern-errors-beautiful'
import bugsPlugin from 'modern-errors-bugs'
import cleanPlugin from 'modern-errors-clean'
import cliPlugin from 'modern-errors-cli'
import httpPlugin, { type HttpResponse } from 'modern-errors-http'
import processPlugin from 'modern-errors-process'
import serializePlugin, { type ErrorObject } from 'modern-errors-serialize'
import switchPlugin from 'modern-errors-switch'
import winstonPlugin, { type Format } from 'modern-errors-winston'
import { expectAssignable, expectType } from 'tsd'

const plugins = [
  beautifulPlugin,
  bugsPlugin,
  cleanPlugin,
  cliPlugin,
  httpPlugin,
  processPlugin,
  serializePlugin,
  switchPlugin,
  winstonPlugin,
]
const BaseError = ModernError.subclass('BaseError', { plugins })
const error = new BaseError('')

ModernError.subclass('TestError', {
  plugins,
  beautiful: { icon: 'warning' },
  bugs: 'https://example.com',
  cli: { silent: true },
  http: { type: '' },
  process: { exit: true },
  winston: { stack: true },
})

expectAssignable<ErrorInstance<typeof plugins>>(error)
expectAssignable<ErrorInstance>(error)
expectAssignable<Error>(error)

expectType<Error['message']>(error.message)
expectType<Error['stack']>(error.stack)

expectType<HttpResponse>(BaseError.httpResponse(error, { type: '' }))
expectType<HttpResponse>(error.httpResponse({ type: '' }))
expectType<void>(BaseError.exit(error, { silent: true }))
expectType<void>(error.exit({ silent: true }))
expectType<string>(BaseError.beautiful(error, { stack: true }))
expectType<string>(error.beautiful({ stack: true }))
const errorObject = BaseError.serialize(error)
expectType<ErrorObject>(errorObject)
expectType<ErrorObject>(error.toJSON())

const restore = BaseError.logProcess({ exit: true })
expectType<void>(restore())
expectType<ErrorInstance>(BaseError.parse(errorObject))
expectType<ErrorInstance>(
  BaseError.switch('').case([TypeError, SyntaxError], BaseError).default(),
)
expectType<Format>(BaseError.fullFormat({ stack: true }))
