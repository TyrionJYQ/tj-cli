module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-console':0,
    'linebreak-style': 0,
    'semi-style': 0,
    'semi': 0,
    'import/no-dynamic-require': 0,
    'global-require': 0,
    'prefer-spread': 0,
    'prefer-template': 0,
    'no-param-reassign': 0
  },
};
