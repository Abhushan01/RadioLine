import babelParser from '@babel/eslint-parser';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginSonarjs from 'eslint-plugin-sonarjs';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [
  {
    files: ['**/*.jsx', '**/*.js'],
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      sonarjs: eslintPluginSonarjs,
      prettier: eslintPluginPrettier,
      'jsx-a11y': eslintPluginJsxA11y,
    },
    rules: {
      // 🛡️ Strict Mode
      strict: ['error', 'global'],

      // ⚙️ Core JavaScript
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-debugger': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-return-await': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'smart'],
      curly: ['error', 'multi-line'],
      'no-var': 'error',
      'object-shorthand': ['warn', 'always'],
      'arrow-body-style': ['warn', 'as-needed'],
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-depth': ['warn', 4],

      // ⚛️ React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'warn',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-uses-vars': 'error',
      'react/self-closing-comp': 'warn',
      'react/jsx-curly-spacing': ['warn', { when: 'never', children: true }],
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/no-unknown-property': 'error',

      // ⚓ React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // 🔒 SonarJS
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-small-switch': 'error',
      'sonarjs/no-nested-switch': 'warn',
      'sonarjs/no-inverted-boolean-check': 'warn',
      'sonarjs/no-unused-collection': 'warn',
      'sonarjs/no-useless-catch': 'error',

      // ♿ Accessibility
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/no-autofocus': ['warn', { ignoreNonDOM: true }],
      'jsx-a11y/no-onchange': 'warn',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/label-has-associated-control': ['warn', { assert: 'either' }],

      // 🎨 Prettier
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
