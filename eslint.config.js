import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';


export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  stylistic.configs.customize(),
  importPlugin.flatConfigs.typescript,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@stylistic/max-len': ['error', { code: 80, ignoreComments: true }],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/indent': ['error', 2, { offsetTernaryExpressions: false }],
      '@stylistic/linebreak-style': 'off',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/func-call-spacing': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0 }],
      '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
      'import/first': 'error',
      'import/newline-after-import': ['error', { count: 2 }],
      'import/order': ['error', {
        'groups': [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type',
        ],
        'pathGroups': [
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        'newlines-between': 'always',
        'pathGroupsExcludedImportTypes': ['type'],
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
      }],
    },
  },
];
