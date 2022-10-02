// If defined, the `bugs` option prints a line recommending to report any
// unknown error.
// The option value can be the `bugs.url` field of `package.json`, which is
// easier to retrieve with JSON imports (Node >=16.14.0)
// eslint-disable-next-line filenames/match-exported
const getOptions = function (bugs = '') {
  return bugs === '' ? bugs : `${BUGS_PREFIX}${ensureBugsUrl(bugs)}`
}

const BUGS_PREFIX = 'Please report this bug at: '

// We enforce `bugs` is a valid URL.
//  - Some terminals add links to URL, which makes it useful
const ensureBugsUrl = function (bugs) {
  if (Object.prototype.toString.call(bugs) === '[object URL]') {
    return bugs
  }

  if (typeof bugs !== 'string') {
    throw new TypeError(`It must be a string or a URL: ${bugs}`)
  }

  try {
    return new URL(bugs)
  } catch (error) {
    throw new TypeError(
      `It must not be "${bugs}" but ${getUrlError(error, bugs)}`,
    )
  }
}

const getUrlError = function (error, bugs) {
  try {
    // eslint-disable-next-line no-new
    new URL(bugs, EXAMPLE_ORIGIN)
    return 'an absolute URL.'
  } catch {
    return `a valid URL: ${error.message}.`
  }
}

const EXAMPLE_ORIGIN = 'https://example.com'

// On any new error, if `cause` has a `bugs`, it is re-appended to the end.
// `bugs` is set at instantiation time instead of during error handling as:
//   - This simplifies error handling logic
//   - This provides with better debugging and more immediate experience
const properties = function ({ error, options }) {
  return options === '' ? {} : { message: `${error.message}\n${options}` }
}

const BUGS_PLUGIN = { name: 'bugs', getOptions, properties }

// eslint-disable-next-line import/no-default-export
export default BUGS_PLUGIN
