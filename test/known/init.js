import test from 'ava'

import { defineCustomClass } from '../helpers/main.js'

test('Does not modify invalid classes', (t) => {
  class custom extends Object {}
  t.throws(defineCustomClass.bind(undefined, custom))
  t.false('name' in custom.prototype)
})
