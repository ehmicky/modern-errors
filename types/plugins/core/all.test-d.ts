import bugsPlugin from 'modern-errors-bugs'
import cliPlugin from 'modern-errors-cli'
import httpPlugin, { HttpResponse } from 'modern-errors-http'
import processPlugin from 'modern-errors-process'
import serializePlugin, { ErrorObject } from 'modern-errors-serialize'
import cleanPlugin from 'modern-errors-clean'
import winstonPlugin, { Format } from 'modern-errors-winston'
import { expectType, expectAssignable } from 'tsd'

import ModernError, { ErrorInstance } from 'modern-errors'

const plugins = [
  bugsPlugin,
  cliPlugin,
  httpPlugin,
  processPlugin,
  serializePlugin,
  cleanPlugin,
  winstonPlugin,
]
const BaseError = ModernError.subclass('BaseError', { plugins })
const error = new BaseError('')

ModernError.subclass('TestError', {
  plugins,
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
const errorObject = error.toJSON()
expectType<ErrorObject>(errorObject)

const restore = BaseError.logProcess({ exit: true })
expectType<void>(restore())
expectType<unknown>(BaseError.parse(errorObject))
expectType<Format>(BaseError.fullFormat({ stack: true }))
