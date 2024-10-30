// eslint-disable-next-line n/no-extraneous-import
import eslintConfig from '@ehmicky/eslint-config'

export default [
  ...eslintConfig,
  {
    rules: {
      'fp/no-class': 0,
    },
  },
  {
    files: ['examples/plugin/*.ts'],
    settings: {
      'import/resolver': {
        typescript: { project: 'examples/plugin/tsconfig.json' },
      },
    },
  },
]


