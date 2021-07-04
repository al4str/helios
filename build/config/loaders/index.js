import { configGetLoaderEslint } from './eslint.js';
import { configGetLoaderScripts } from './scripts.js';
import { configGetLoaderStyles } from './styles.js';
import { configGetLoaderFont } from './font.js';

const loaders = [
  configGetLoaderEslint,
  configGetLoaderScripts,
  configGetLoaderStyles,
  configGetLoaderFont,
];

/**
 * @param {BuildParams} params
 * */
export async function configGetLoaders(params) {
  const results = await Promise.all(loaders.map((loader) => {
    return loader(params);
  }));

  return results.filter(Boolean);
}
