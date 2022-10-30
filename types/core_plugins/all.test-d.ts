import bugsPlugin from 'modern-errors-bugs'
import cliPlugin from 'modern-errors-cli'
import httpPlugin from 'modern-errors-http'
import processPlugin from 'modern-errors-process'
import serializePlugin from 'modern-errors-serialize'
import stackPlugin from 'modern-errors-stack'
import winstonPlugin from 'modern-errors-winston'
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
expectAssignable<Error>(error)

expectType<string>(error.message)
expectType<string | undefined>(error.stack)

error.httpResponse({ type: '' })
const errorObject = error.toJSON()

AnyError.exit({ silent: true })
AnyError.logProcess({ exit: true })
AnyError.parse(errorObject)
AnyError.fullFormat({ stack: true })
