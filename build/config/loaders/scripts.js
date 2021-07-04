import { configGetLoaderBabel } from './babel.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaderScripts(params) {
  return {
    test: /\.js$/,
    exclude: [/node_modules/],
    use: [
      await configGetLoaderBabel(params),
    ],
  };
}
