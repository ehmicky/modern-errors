// eslint-disable-next-line filenames/match-exported
import handleCliError, { validateOptions } from 'handle-cli-error'

const getOptions = function (options = {}) {
  validateOptions(options)

  if (options.classes !== undefined) {
    throw new TypeError(`"cli.classes" must not be defined: ${options.classes}`)
  }

  return options
}

const exit = function ({ options }) {
  handleCliError(options)
}

const CLI_PLUGIN = { name: 'cli', getOptions, instanceMethods: { exit } }

// eslint-disable-next-line import/no-default-export
export default CLI_PLUGIN
