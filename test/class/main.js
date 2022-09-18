import test from 'ava'

import { defineClassOpts } from '../helpers/main.js'

test('Does not modify invalid classes', (t) => {
  class custom extends Object {}
  t.throws(defineClassOpts.bind(undefined, { custom }))
  t.false('name' in custom.prototype)
})
