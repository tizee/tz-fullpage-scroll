// Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
import commonjs from '@rollup/plugin-commonjs';
// compiler
import babel from '@rollup/plugin-babel';
// locates third party modules in node_modules
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
// typescript
// import typescript from '@rollup/plugin-typescript';

/* resolve options */
const extensions = ['.js', '.ts', '.jsx', '.tsx'];

export default {
  input: 'src/scroll.ts',
  // external modules that exclude from the bundle file
  external: [],
  plugins: [
    resolve({ extensions }), // locate modules
    commonjs(), // Convert CommonJS to ES
    // typescript(), // Convert TS to JS
    babel({
      extensions,
      babelHelpers: 'bundled', // 'runtime' for building libraries with @babel/plugin-transform-runtime and @babel/runtime, 'bundled' for building application code
    }),
  ],
  output: [
    // browser-friendly UMD build
    // Browser and NodeJS
    {
      file: pkg.browser,
      format: 'iife',
      name: 'PageScroll',
    },
    // CommonJS (Node) and ES module (for bundlers) build
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
};
