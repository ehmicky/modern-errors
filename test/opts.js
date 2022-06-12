import test from 'ava'
import modernErrors from 'modern-errors'
import { each } from 'test-each'

each(
  [
    true,
    // eslint-disable-next-line unicorn/no-null
    null,
    { onCreate: true },
    ...[true, '', '/relativeUrl', 'http://example.com%'].map((bugsUrl) => ({
      bugsUrl,
    })),
  ],
  ({ title }, opts) => {
    test(`Validate options | ${title}`, (t) => {
      t.throws(modernErrors.bind(undefined, opts))
    })
  },
)
