import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';

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
    reactOutputTarget({
      componentCorePackage: '../../../dist/types',
      proxiesFile: './generated/lt-component-react/src/components.ts'
    }),
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
    },
    {
      type: 'docs-json',
      file: './dist/components.json'
    }
  ],
};
