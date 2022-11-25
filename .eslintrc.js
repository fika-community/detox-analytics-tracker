module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
    //
  },
  // prettier should be last so that it overrides all other configs, basically saying, don't error on whatever you've got configured for prettier
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier', 'chai-friendly'],
  rules: {
    'prettier/prettier': 'warn', // in combination with plugins: ['prettier'] will show prettier conflicts (you might have to reload the window after you've made changes to .prettierrc)
    'no-shadow': 'off',
    'consistent-return': 'off',
    'arrow-body-style': ['off', 'as-needed'],
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'import/named': 'off',
    'import/prefer-default-export': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'class-methods-use-this': 'off',
    'no-nested-ternary': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }], // Allow functions to be declared after being called, but only if they're hoisted
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'], // Basically just remove restricting ForOfStatement from Airbnb defaults
    'no-await-in-loop': 'off',
    // Backend specific config
    'no-console': 'off',
  },
  ignorePatterns: ['dist', 'elasticsearch-*'],
  // chai specific config so that no-unused-expressions rule still applies in test files but not to
  // chai assertions so that you can do stuff like expect(userHabits[0].createdAt).to.exist
  overrides: [
    {
      files: '*.test.js',
      rules: {
        'no-unused-expressions': 'off',
        'chai-friendly/no-unused-expressions': 'error',
      },
    },
  ],
}
