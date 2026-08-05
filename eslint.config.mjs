import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginWdio from 'eslint-plugin-wdio';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginWdio.configs['flat/recommended'],
  eslintPluginPrettier,
  eslintConfigPrettier,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'ctrf/**',
      'ctrf-html-report/**',
      'logs/**',
      'apps/**',
      '*.json',
      '*.html',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      'prettier/prettier': 'error',
    },
  },
);
