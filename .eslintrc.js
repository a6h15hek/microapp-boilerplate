module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'semi': ['error', 'always'], // Enforce semicolons
    'quotes': ['error', 'single'], // Enforce single quotes
    'indent': ['error', 2], // Enforce 2-space indentation
    'no-unused-vars': ['warn', { 'varsIgnorePattern': '^(React|process)$' }],
    //'no-console': ['warn'], // Warn on console statements
    'react/jsx-uses-react': 'off', // Not needed with React 17+
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
    'react/prop-types': 'off', // Disable prop-types as we use TypeScript
    'react/jsx-uses-vars': 'error', // Prevent variables used in JSX from being marked as unused
    'react/jsx-key': 'error', // Ensure key prop is present in list items
    'react/jsx-no-duplicate-props': 'error', // Prevent duplicate props in JSX
    'react/jsx-no-undef': 'error', // Disallow undeclared variables in JSX
    'react/jsx-pascal-case': 'error', // Enforce PascalCase for user-defined JSX components
    'react/no-children-prop': 'error', // Prevent passing children as props
    'react/no-danger': 'warn', // Prevent usage of dangerous JSX properties
    'react/no-deprecated': 'warn', // Prevent usage of deprecated methods
    'react/no-direct-mutation-state': 'error', // Prevent direct mutation of this.state
    'react/no-find-dom-node': 'warn', // Prevent usage of findDOMNode
    'react/no-is-mounted': 'error', // Prevent usage of isMounted
    'react/no-render-return-value': 'error', // Prevent usage of the return value of React.render
    'react/no-string-refs': 'error', // Prevent usage of string refs
    'react/no-unescaped-entities': 'error', // Prevent invalid characters from appearing in markup
    'react/no-unknown-property': 'error', // Prevent usage of unknown DOM property
    'react/no-unsafe': 'warn', // Prevent usage of unsafe lifecycle methods
    'react/require-render-return': 'error', // Enforce ES6 class to have a render method
    'react/self-closing-comp': 'error', // Prevent extra closing tags for components without children
    'react/style-prop-object': 'error', // Enforce style prop value to be an object

    // Additional spacing and best practice rules
    'comma-spacing': ['error', { 'before': false, 'after': true }], // Enforce spacing after comma
    'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }], // Enforce spacing around colons in object literals
    'space-infix-ops': ['error', { 'int32Hint': false }], // Require spacing around infix operators
    'array-bracket-spacing': ['error', 'never'], // Disallow spaces inside array brackets
    'object-curly-spacing': ['error', 'always'], // Enforce consistent spacing inside braces
    'space-before-blocks': ['error', 'always'], // Enforce consistent spacing before blocks
    'space-before-function-paren': ['error', 'never'], // Enforce consistent spacing before function parentheses
    'space-in-parens': ['error', 'never'], // Disallow spaces inside parentheses
    'space-unary-ops': ['error', { 'words': true, 'nonwords': false }], // Enforce consistent spacing before/after unary operators
    'spaced-comment': ['error', 'always', { 'exceptions': ['-', '+'] }], // Enforce consistent spacing after the `//` or `/*` in a comment
    'sort-imports': ['error', { 'ignoreCase': true, 'ignoreDeclarationSort': true }], // Enforce sorted import declarations within modules
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the react version
    },
  },
};
