import test from 'ava'
import { each } from 'test-each'

import { ErrorClasses } from '../../helpers/main.test.js'

const { propertyIsEnumerable: isEnum } = Object.prototype

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`ErrorClass.normalize() recurse over aggregate errors | ${title}`, (t) => {
    const error = new ErrorClass('test', { errors: [true] })
    const normalizedError = ErrorClass.normalize(error)
    t.true(normalizedError.errors[0] instanceof ErrorClass)
    t.false(isEnum.call(normalizedError, 'errors'))
  })

  test(`ErrorClass.normalize() recurse over aggregate non-errors | ${title}`, (t) => {
    const error = new ErrorClass('test')
    error.errors = [true]
    t.true(ErrorClass.normalize(error).errors[0] instanceof ErrorClass)
  })

  test(`ErrorClass.normalize() recurse over aggregate errors deeply | ${title}`, (t) => {
    const innerError = new ErrorClass('test', { errors: [true] })
    const error = new ErrorClass('test', { errors: [innerError] })
    t.true(
      ErrorClass.normalize(error).errors[0].errors[0] instanceof ErrorClass,
    )
  })

  test(`ErrorClass.normalize() handles infinite recursions | ${title}`, (t) => {
    const error = new ErrorClass('test')
    error.errors = [error]
    t.deepEqual(ErrorClass.normalize(error).errors, [])
  })
})
