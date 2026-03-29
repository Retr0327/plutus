/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
export default {
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '^typeorm(.*)$',
    '^@nestjs/(.*)$',
    '^@canine/(.*)$',
    '^\\./(.*)$',
    '^\\.\\./(.*)',
  ],
  importOrderParserPlugins: [
    'typescript',
    'decorators-legacy',
    'classProperties',
  ],
};
