import path from 'path';
import { fileURLToPath } from 'url';
import eslint from '@eslint/js';
import jesteslint from 'eslint-plugin-jest';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    ignores: [
      '**/.eslintrc.js',
      '**/node_modules',
      '**/dist',
      '.prettierrc.mjs',
      'commitlint.config.mjs',
    ],
  },
  {
    // TypeScript ESLint specific rules
    // https://typescript-eslint.io/rules/
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/return-await': 'error',
      'no-return-await': 'off',
      '@typescript-eslint/return-await': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
  {
    plugins: { jest: jesteslint },
    rules: {
      ...jesteslint.configs['flat/recommended'].rules,
      'jest/no-export': 'off',
      'jest/expect-expect': 'off',
      'jest/valid-title': 'off',
    },
  },
]);
