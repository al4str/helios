import { configGetLoaderSCSS } from './scss.js';
import { configGetLoaderPostcss } from './postcss.js';
import { configGetLoaderCSS } from './css.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderStyles(params) {
  return {
    test: /\.scss$/,
    use: [
      await configGetLoaderCSS(params),
      {
        loader: 'css-loader',
        options: {
          url: true,
          import: true,
          modules: {
            mode: 'local',
            localIdentName: '[local]-[contenthash:8]',
          },
          importLoaders: 2,
          sourceMap: true,
        },
      },
      await configGetLoaderPostcss(params),
      await configGetLoaderSCSS(params),
    ],
  };
}
