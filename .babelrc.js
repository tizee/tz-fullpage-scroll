// more on https://babeljs.io/docs/en/presets#preset-options
const presets = [
  '@babel/preset-env',
  [
    '@babel/preset-typescript',
    {
      isTsx: false, // Forcibly enables jsx parsing.
      //  jsxPragma: 'React', // Replace the function used when compiling JSX expressions
      allExtensions: false, // Indicates that every file should be parsed as TS or TSX (depending on the isTSX option).
      allowNamespaces: true, // Enables compilation of TypeScript namespaces.
      allowDeclareFields: false, // default true in Babel 8
      onlyRemoveTypeImports: false, // When set to true, the transform will only remove type-only imports (introduced in TypeScript 3.8).
    },
  ],
];

const plugins = ['@babel/plugin-proposal-class-properties'];

const ignore = ['dist', 'src/__tests__'];

module.exports = {
  presets,
  plugins,
  ignore,
};
