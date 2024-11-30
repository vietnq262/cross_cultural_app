/** @type {import('prettier').Config} */
module.exports = {
  plugins: [
    'prettier-plugin-tailwindcss',
    '@trivago/prettier-plugin-sort-imports',
  ],
  tailwindFunctions: ['cn', 'clsx'],
  singleQuote: true,
  jsxSingleQuote: true,
  semi: true,
  tabWidth: 2,
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  trailingComma: 'all',
  importOrder: [
    'server-only',
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
};
