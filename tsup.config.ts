import { defineConfig, Options } from 'tsup';

const commonConfig: Options = {
  minify: true,
  /* emit types */
  dts: true,
  format: ['esm', 'cjs'],
  sourcemap: false,
  clean: true,
};
export default defineConfig([
  {
    ...commonConfig,
    esbuildOptions: (options) => {
      // Append "use client" to the top of the react entry point
      options.banner = {
        js: '"use client";',
      };
    },
    entry: ['src/toaster/index.ts'],
    outDir: 'dist',
  }
]);