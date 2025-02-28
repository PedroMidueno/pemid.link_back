module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin', '@stylistic/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js', 'postgres', 'dist'],
  rules: {
    'prettier/prettier': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'require-await': 'error',
    '@stylistic/eol-last': 'error',
    '@stylistic/no-multiple-empty-lines': 'error',
    '@stylistic/no-trailing-spaces': 'error',
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/comma-dangle': ['error', 'never'],
    '@stylistic/comma-spacing': ['error', { before: false, after: true }],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/arrow-spacing': 'error',
    '@stylistic/function-call-spacing': ['error', 'never'],
    '@stylistic/arrow-parens': ['error', 'as-needed'],
    '@stylistic/array-bracket-spacing': ['error', 'never'],
    '@stylistic/block-spacing': 'error',
    '@stylistic/object-curly-spacing': ['error', 'always', { arraysInObjects: true, objectsInObjects: true }],
    '@stylistic/array-bracket-newline': ['error', 'consistent'],
    '@stylistic/max-len': ['error', { code: 120 }],
    '@stylistic/key-spacing': 'error',
    '@stylistic/space-infix-ops': 'error',
    '@stylistic/dot-location': ['error', 'property'],
    '@stylistic/space-in-parens': ['error', 'never'],
    '@stylistic/keyword-spacing': 'error',
    '@stylistic/space-before-blocks': 'error',
    '@stylistic/type-annotation-spacing': 'error',
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/indent': ['warn', 2, {
      ignoredNodes: [
        'FunctionExpression > .params[decorators.length > 0]',
        'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
        'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key'
      ]
    }]
  }
}
