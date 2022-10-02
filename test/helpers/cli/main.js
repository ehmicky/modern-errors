import { mockConsole, unmockConsole, getConsoleArg } from './console.js'
import {
  mockProcessExit,
  unmockProcessExit,
  getProcessExitCode,
} from './exit.js'

// `modern-errors-cli` use global variables `process.exitCode`, `process.exit()`
// and `console.error()` so we need to mock them.
export const errorExit = function (error, options) {
  mockConsole()
  mockProcessExit()

  try {
    error.exit(options)
    const consoleArg = getConsoleArg()
    const exitCode = getProcessExitCode()
    return { consoleArg, exitCode }
  } finally {
    unmockProcessExit()
    unmockConsole()
  }
}
