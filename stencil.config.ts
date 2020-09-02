import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'lt-component',
  taskQueue: 'async',
  buildEs5: true,
  globalStyle: 'src/globalStyle/global.scss',
  plugins: [
    sass({
      includePaths: [
        'src/globalStyle',
        './node_modules',
        'src/assets'
      ]
    })
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle'
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        { src: 'assets/fontawesome/webfonts', dest: 'webfonts' },
      ]
    },
    {
      type: 'docs-json',
      file: './dist/components.json'
    }
  ],
};
