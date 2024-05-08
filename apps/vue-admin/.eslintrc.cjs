/*
 * @Author: CP
 * @Date: 2024-01-08 20:35:06
 * @LastEditors: Please set LastEditors
 * @Description: 
 */
module.exports = {
  env: {
    // browser: true,
    // es2021: true
  },
  // extends: [
  //   'eslint:recommended',
  //   'plugin:@typescript-eslint/recommended',
  //   'plugin:vue/vue3-essential',
  //   'prettier'
  // ],
  'extends': [
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-prettier/skip-formatting',
    'prettier'

  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true
        }
      },
    }
  ],
  // parserOptions: {
  //   ecmaVersion: 'latest',
  //   parser: '@typescript-eslint/parser',
  //   sourceType: 'module'
  // },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    "vue/valid-template-root": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-multiple-template-root": "off",
    "vue/valid-define-emits": "warn",
    "prefer-const": "off"
  }
}
