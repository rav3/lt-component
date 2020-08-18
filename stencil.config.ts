import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'lt-component',
  taskQueue: 'async',
  buildEs5: true,
  globalStyle: 'src/globalStyle/global.scss',
  plugins: [
    sass({
      includePaths: ['src/globalStyle']
    })
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
