import { basename } from 'node:path'

import test from 'ava'
import { each } from 'test-each'

import {
  ErrorClasses,
  ErrorSubclasses,
  ModernError,
} from './helpers/main.test.js'
import { getUnknownErrors } from './helpers/unknown.test.js'

const { propertyIsEnumerable: isEnum } = Object.prototype

const isStackLine = function (line) {
  return line.trim().startsWith('at ')
}

each(ErrorClasses, ({ title }, ErrorClass) => {
  const message = 'test'
  const error = new ErrorClass(message)

  test(`instanceof can be used with known errors | ${title}`, (t) => {
    t.true(error instanceof Error)
    t.true(error instanceof ErrorClass)
    t.true(error instanceof ModernError)
  })

  test(`error.constructor is correct | ${title}`, (t) => {
    t.is(error.constructor, ErrorClass)
  })

  test(`error.message is correct | ${title}`, (t) => {
    t.is(error.message, message)
    t.false(isEnum.call(error, 'message'))
  })

  test(`error.stack is correct | ${title}`, (t) => {
    t.true(error.stack.includes(message))
    t.false(isEnum.call(error, 'stack'))
  })

  test(`error.stack does not include the constructor | ${title}`, (t) => {
    const lines = error.stack.split('\n')
    const stackIndex = lines.findIndex(isStackLine)
    t.true(lines[stackIndex].includes(basename(import.meta.url)))
  })

  test(`error.toString() is correct | ${title}`, (t) => {
    t.is(error.toString(), `${ErrorClass.name}: ${message}`)
  })
})

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`instanceof prevents naming collisions | ${title}`, (t) => {
    const OtherError = ModernError.subclass(ErrorClass.name)
    t.false(new OtherError('test') instanceof ErrorClass)
  })
})

each(getUnknownErrors(), ({ title }, getUnknownError) => {
  test(`instanceof can be used with known errors | ${title}`, (t) => {
    t.false(getUnknownError() instanceof ModernError)
  })
})
