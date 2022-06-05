// Normalize and retrieve options
export const getOpts = function (opts = {}) {
  if (!isObject(opts)) {
    throw new TypeError(`Options must be a plain object: ${opts}`)
  }

  const { onCreate, bugsUrl } = opts
  validateOnCreate(onCreate)
  const bugsUrlA = normalizeBugsUrl(bugsUrl)
  return { onCreate, bugsUrl: bugsUrlA }
}

const isObject = function (value) {
  return typeof value === 'object' && value !== null
}

const validateOnCreate = function (onCreate) {
  if (onCreate !== undefined && typeof onCreate !== 'function') {
    throw new TypeError(`"onCreate" option must be a function: ${onCreate}`)
  }
}

const normalizeBugsUrl = function (bugsUrl) {
  if (bugsUrl === undefined) {
    return
  }

  if (typeof bugsUrl !== 'string') {
    throw new TypeError(`"bugsUrl" option must be a string: ${bugsUrl}`)
  }

  try {
    return String(new URL(bugsUrl))
  } catch (error) {
    throw new Error(
      `"bugsUrl" option "${bugsUrl}" must be ${getUrlError(error, bugsUrl)}`,
    )
  }
}

const getUrlError = function (error, bugsUrl) {
  try {
    // eslint-disable-next-line no-new
    new URL(bugsUrl, EXAMPLE_ORIGIN)
    return 'an absolute URL.'
  } catch {
    return `a valid URL: ${error.message}.`
  }
}

const EXAMPLE_ORIGIN = 'https://www.example.com'
