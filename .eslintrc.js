const { getESLintConfig } = require('@iceworks/spec');

// https://www.npmjs.com/package/@iceworks/spec
module.exports = getESLintConfig('react-ts', {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-prettier'],
  rules: {
    '@iceworks/best-practices/no-js-in-ts-project': 'off',
    '@iceworks/best-practices/no-secret-info': 'off',
    '@typescript-eslint/no-require-imports': 'warn',
    '@typescript-eslint/no-use-before-define': 'off',
    '@iceworks/best-practices/no-http-url': 'off',
    'no-use-before-define': 'off',
    'prettier/prettier': [
      process.env.NODE_ENV === 'production' ? 'off' : 'error',
      // prettier 规则配置
      {
        endOfLine: 'auto', // 换行cr检查
      },
    ],
    'max-lines': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  extends: ['eslint-config-prettier', 'plugin:prettier/recommended'],
});
