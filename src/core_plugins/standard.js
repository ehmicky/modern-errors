// eslint-disable-next-line filenames/match-exported
const getOptions = function ({ options }) {
  return options
}

const toStandard = function ({ error }) {
  return {}
}

const STANDARD_PLUGIN = {
  name: 'stack',
  getOptions,
  instanceMethods: { toStandard },
}

// eslint-disable-next-line import/no-default-export
export default STANDARD_PLUGIN
