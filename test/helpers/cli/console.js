// eslint-disable-next-line no-restricted-globals, no-console
const originalConsoleError = console.error

// Mock `console.error()` during tests
export const mockConsole = function () {
  // eslint-disable-next-line fp/no-mutation, no-restricted-globals, no-console
  console.error = mockedConsoleError
}

const mockedConsoleError = function (arg) {
  // eslint-disable-next-line fp/no-mutation
  consoleArg = arg
}

// Retrieve value passed to mocked `console.error()`
export const getConsoleArg = function () {
  return consoleArg
}

// Reverse `mockConsole()`
export const unmockConsole = function () {
  // eslint-disable-next-line fp/no-mutation, no-restricted-globals, no-console
  console.error = originalConsoleError
  // eslint-disable-next-line fp/no-mutation
  consoleArg = undefined
}

// eslint-disable-next-line fp/no-let, init-declarations
let consoleArg
