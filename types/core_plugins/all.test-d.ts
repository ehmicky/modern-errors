import cliPlugin from 'modern-errors-cli'
import { expectType, expectAssignable } from 'tsd'

import modernErrors, { ErrorInstance } from '../main.js'
import bugsPlugin from './bugs.js'
import httpPlugin from './http.js'
import processPlugin from './process.js'
import serializePlugin from './serialize.js'
import stackPlugin from './stack.js'
import winstonPlugin from './winston.js'

const plugins = [
  bugsPlugin,
  // cliPlugin,
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
  // cli: { silent: true },
  http: { type: '' },
  process: { exit: true },
  winston: { stack: true },
})

expectAssignable<ErrorInstance<typeof plugins>>(error)
expectAssignable<Error>(error)

expectType<string>(error.message)
expectType<string>(error.stack)

error.httpResponse({ type: '' })
const errorObject = error.toJSON()

// AnyError.exit({ silent: true })
AnyError.logProcess({ exit: true })
AnyError.parse(errorObject)
AnyError.fullFormat({ stack: true })
