module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts'],
      },
    },
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    semi: ['error', 'never'],
    'max-len': ['error', { code: 120 }],
    'no-plusplus': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    yoda: 'off',
    'import/extensions': 'off',
    'lines-between-class-members': 'off',
    'space-before-function-paren': ['error', 'always'],
    'no-return-assign': 'off',
    'no-mixed-operators': 'off',
  },
}
