// eslint-disable-next-line filenames/match-exported
import handleCliError from 'handle-cli-error'

const getOptions = function ({ options = {} }) {
  return options
}

const exit = function ({ options }) {
  handleCliError(options)
}

const CLI_PLUGIN = { name: 'cli', getOptions, instanceMethods: { exit } }

// eslint-disable-next-line import/no-default-export
export default CLI_PLUGIN
