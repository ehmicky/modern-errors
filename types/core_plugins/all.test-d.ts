import bugsPlugin from 'modern-errors-bugs'
import cliPlugin from 'modern-errors-cli'
import httpPlugin, { HttpResponse } from 'modern-errors-http'
import processPlugin from 'modern-errors-process'
import serializePlugin, { ErrorObject } from 'modern-errors-serialize'
import stackPlugin from 'modern-errors-stack'
import winstonPlugin, { Format } from 'modern-errors-winston'
import { expectType, expectAssignable } from 'tsd'

import modernErrors, { ErrorInstance } from '../main.js'

const plugins = [
  bugsPlugin,
  cliPlugin,
  httpPlugin,
  processPlugin,
  serializePlugin,
  stackPlugin,
  winstonPlugin,
]
const AnyError = modernErrors(plugins)
const error = new AnyError('', { cause: '' })

modernErrors(plugins, {
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

expectType<HttpResponse>(error.httpResponse({ type: '' }))
expectType<void>(error.exit({ silent: true }))
const errorObject = error.toJSON()
expectType<ErrorObject>(errorObject)

const restore = AnyError.logProcess({ exit: true })
expectType<void>(restore())
expectType<ErrorInstance>(AnyError.parse(errorObject))
expectType<Format>(AnyError.fullFormat({ stack: true }))
