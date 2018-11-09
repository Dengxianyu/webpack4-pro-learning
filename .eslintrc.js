module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
  // required to lint *.vue files
  plugins: ['vue', 'prettier'],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'no-trailing-spaces': ['error', { ignoreComments: true }],
    'implicit-arrow-linebreak': 'off',
    'arrow-parens': 0,
    'operator-linebreak': 0,
    'func-names': ['error', 'never'],
    'space-before-function-paren': 0,
    'consistent-return': 'off'
  }
}
