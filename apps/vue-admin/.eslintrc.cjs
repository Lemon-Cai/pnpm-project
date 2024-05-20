/*
 * @Author: CP
 * @Date: 2024-01-08 20:35:06
 * @LastEditors: Please set LastEditors
 * @Description: 
 */
module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  // extends: [
  //   'eslint:recommended',
  //   'plugin:@typescript-eslint/recommended',
  //   'plugin:vue/vue3-essential',
  //   'prettier'
  // ],
  'extends': [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
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
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'warn',
    "prefer-const": "off",

    'vue/require-prop-types': 0,
    'vue/no-unused-vars': 'warn',
    'vue/attributes-order': 'off',
    'vue/valid-v-model': 'off',
    'vue/no-template-key': 0,
    'vue/no-use-v-if-with-v-for': [
      'warn',
      {
        allowUsingIterationVar: true,
      },
    ],
    "vue/valid-template-root": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-multiple-template-root": "off",
    "vue/valid-define-emits": "warn",

    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
  }
}
