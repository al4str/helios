import path from 'path';
import { PUBLIC_PATH, MAIN_CHUNK_GROUP } from '../constants.js';

const IGNORER_EXT_REG_EXP = /(\.html|gz|map|txt|ttf|woff2?)$/i;

/**
 * @param {WebpackStats} stats
 * @return {WebpackStatsOutput}
 * */
export function assetsGetStatsOutput(stats) {
  return stats.toJson({
    all: false,
    assets: true,
    cachedAssets: true,
    chunkGroups: true,
  });
}

/**
 * @param {WebpackStatsOutput} stats
 * @return {Array<BuildAssetItem>}
 * */
export function assetsGetItemsCopied(stats) {
  return stats.assets
    .filter((asset) => {
      return typeof asset.info === 'object'
        && asset.info !== null
        && asset.info.copied === true;
    })
    .map((asset) => {
      const dirPath = path
        .dirname(asset.name)
        .replace(/^\/\.\./, '');
      const hashedName = path.basename(asset.name);
      const originalName = path.basename(asset.info.sourceFilename);

      return {
        originalPath: path.join(dirPath, originalName),
        outputPath: path.join(PUBLIC_PATH, dirPath, hashedName),
      };
    });
}

/**
 * @param {Array<BuildAssetItem>} items
 * @param {string} originalPath
 * @return {string}
 * */
export function assetsGetItemURLByOriginalPath(items, originalPath) {
  const { outputPath } = items.find((asset) => asset.originalPath === originalPath)
    || { outputPath: '' };

  return outputPath;
}

/**
 * @param {Array<BuildAssetItem>} items
 * @return {Record<string, string>}
 * */
export function assetsGetItemsMap(items) {
  const entries = items
    .filter((asset) => {
      return !IGNORER_EXT_REG_EXP.test(asset.originalPath);
    })
    .map((asset) => {
      return [asset.originalPath, asset.outputPath];
    });

  return Object.fromEntries(entries);
}

/**
 * @param {WebpackStatsOutput} stats
 * @return {BuildChunkGroups}
 * */
export function assetsGetChunkGroups(stats) {
  /** @type {Array<[string, Array<string>]>} */
  const chunkGroupsEntries = Object
    .entries(stats.namedChunkGroups)
    .map(([name, group]) => {
      const assets = group.assets
        .filter((asset) => {
          const ext = path.extname(asset.name);

          return ['.css', '.js'].includes(ext);
        })
        .map((asset) => {
          return path.join(PUBLIC_PATH, asset.name);
        });

      return [name, assets];
    });

  return Object.fromEntries(chunkGroupsEntries);
}

/**
 * @param {BuildChunkGroups} chunkGroups
 * @return {{
 *   mainGroup: Array<string>
 *   restGroups: Record<string, <Array<string>>
 * }}
 * */
export function assetsSplitChunkGroups(chunkGroups) {
  const { [MAIN_CHUNK_GROUP]: mainGroup, ...restGroups } = chunkGroups;

  return {
    mainGroup: mainGroup || [],
    restGroups: restGroups || {},
  };
}

/**
 * @param {string} name
 * @param {Object} value
 * @return {string}
 * */
export function assetsGetScriptString(name, value) {
  return [
    '<script>',
    `window['${name}']`,
    '=',
    'JSON.parse(\'',
    JSON.stringify(value, null, 0),
    '\')',
    '</script>',
  ].join('');
}
