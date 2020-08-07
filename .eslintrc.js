module.exports = {
  /* more details on https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md */
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommend',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],
};
