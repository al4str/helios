import { targetsGetConfig } from '../../utils/targets.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderBabel(params) {
  const targets = targetsGetConfig(params.modern);
  const cacheDirectory = params.modern
    ? 'node_modules/.cache/babel-loader/modern'
    : 'node_modules/.cache/babel-loader/legacy';
  const corejs = params.modern
    ? undefined
    : 3;
  const useBuiltIns = params.modern
    ? false
    : 'usage';

  return {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      presets: [
        ['@babel/preset-env', {
          bugfixes: true,
          modules: 'auto',
          corejs,
          useBuiltIns,
          targets,
        }],
        ['@babel/preset-react', {
          runtime: 'automatic',
        }],
      ],
      cacheDirectory,
      cacheCompression: false,
    },
  };
}
