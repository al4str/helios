import fs from 'fs';
import path from 'path';
import {
  ROOT_DIR,
  META_ITEMS,
  ASSETS_VAR_NAME,
  ROUTES_CHUNKS_VAR_NAME,
} from '../constants.js';
import {
  assetsGetStatsOutput,
  assetsGetItemsCopied,
  assetsGetItemsMap,
  assetsGetItemURLByOriginalPath,
  assetsGetChunkGroups,
  assetsGetMainChunkGroup,
  assetsGetScriptString,
} from './assets.js';
import {
  tagsCreateItem,
  tagsGetItemHint,
  tagsItemsToString,
  tagsGetItemsGrouped,
  tagsGenerateItems,
} from './tags.js';
import { htmlMinify } from './html.js';

const TEMPLATE_PATH = path.join(ROOT_DIR, 'src/templates/index.html');

const SPLASH_ICON_PATH = 'assets/brand/logo-icon-white.svg';

/**
 * @param {Object} params
 * @param {boolean} [params.production=true]
 * @param {Array<WebpackStats>} params.statsList
 * @return {string}
 * */
export function templatesRender(params) {
  const {
    production = true,
    statsList,
  } = params;
  const tokensMaps = statsList.map((statsItem) => {
    return templatesGetTokens({ stats: statsItem });
  });
  const combinedTokens = templatesMergeTokensMaps(tokensMaps);
  const tokensStringMap = templatesTokensMapToString(combinedTokens);
  const rawHTML = templatesInjectTokens(tokensStringMap);

  templatesThrowIfUnusedTokensFound(rawHTML);

  return production
    ? htmlMinify(rawHTML)
    : rawHTML;
}

/**
 * @param {Object} params
 * @param {WebpackStats} params.stats
 * @return {BuildTemplateTokensMap}
 * */
function templatesGetTokens(params) {
  const { stats } = params;
  const statsOutput = assetsGetStatsOutput(stats);
  const itemsCopied = assetsGetItemsCopied(statsOutput);
  const chunkGroups = assetsGetChunkGroups(statsOutput);
  const mainChunk = assetsGetMainChunkGroup(chunkGroups);
  const mainItems = tagsGenerateItems(mainChunk);
  const mainItemsGrouped = tagsGetItemsGrouped(mainItems);
  const itemsMap = assetsGetItemsMap(itemsCopied);
  const itemsMeta = templatesGenerateMetaItems(itemsCopied, META_ITEMS);
  const splashIconURL = assetsGetItemURLByOriginalPath(itemsCopied, SPLASH_ICON_PATH);
  const splashIconHintItem = tagsGetItemHint(splashIconURL, 'preload');
  const itemsPreload = mainItemsGrouped.preload.concat([splashIconHintItem]);

  return {
    metaTags: tagsItemsToString(itemsMeta),
    prefetchTags: tagsItemsToString(mainItemsGrouped.prefetch),
    preloadTags: tagsItemsToString(itemsPreload),
    styleTags: tagsItemsToString(mainItemsGrouped.style),
    assetsMap: itemsMap,
    chunksMap: chunkGroups,
    moduleTags: tagsItemsToString(mainItemsGrouped.module),
    nomoduleTags: tagsItemsToString(mainItemsGrouped.nomodule),
    splashIconURL,
  };
}

/**
 * @param {Array<BuildAssetItem>} assetsItems
 * @param {Array<BuildMetaItem>} metaItems
 * @return {Array<BuildTagItem>}
 * */
function templatesGenerateMetaItems(assetsItems, metaItems) {
  return metaItems.map((metaItem) => {
    return tagsCreateItem('link', {
      ...metaItem.attributes,
      href: assetsGetItemURLByOriginalPath(assetsItems, metaItem.originalPath),
    });
  });
}

/**
 * @param {Array<BuildTemplateTokensMap>} tokensMaps
 * @return {BuildTemplateTokensMap}
 * */
function templatesMergeTokensMaps(tokensMaps) {
  /** @type {BuildTemplateTokensMap} */
  const resultMap = {
    metaTags: [],
    prefetchTags: [],
    preloadTags: [],
    styleTags: [],
    assetsMap: {},
    chunksMap: {},
    moduleTags: [],
    nomoduleTags: [],
    splashIconURL: '',
  };

  tokensMaps.forEach((tokensMap) => {
    const names = [
      'metaTags', 'prefetchTags', 'preloadTags',
      'styleTags', 'moduleTags', 'nomoduleTags',
    ];
    names.forEach((name) => {
      /** @type {Array<string>} */
      const tags = tokensMap[name];
      tags.forEach((tag) => {
        if (!resultMap[name].includes(tag)) {
          resultMap[name].push(tag);
        }
      });
    });

    Object
      .entries(tokensMap.assetsMap)
      .forEach(([originalPath, url]) => {
        if (!(originalPath in resultMap.assetsMap)) {
          resultMap.assetsMap[originalPath] = url;
        }
      });

    Object
      .entries(tokensMap.chunksMap)
      .forEach(([chunkName, urls]) => {
        /** @type {Array<string>} */
        const prevURLs = resultMap.chunksMap[chunkName] || [];
        urls.forEach((url) => {
          if (!prevURLs.includes(url)) {
            resultMap.chunksMap[chunkName] = prevURLs.concat([url]);
          }
        });
      });

    if (tokensMap.splashIconURL) {
      resultMap.splashIconURL = tokensMap.splashIconURL;
    }
  });

  return resultMap;
}

/**
 * @param {BuildTemplateTokensMap} tokensMap
 * @return {BuildTemplateTokensStringMap}
 * */
function templatesTokensMapToString(tokensMap) {
  return {
    metaTags: tokensMap.metaTags.join('\n'),
    prefetchTags: tokensMap.prefetchTags.join('\n'),
    preloadTags: tokensMap.preloadTags.join('\n'),
    styleTags: tokensMap.styleTags.join('\n'),
    assetsMap: assetsGetScriptString(ASSETS_VAR_NAME, tokensMap.assetsMap),
    chunksMap: assetsGetScriptString(ROUTES_CHUNKS_VAR_NAME, tokensMap.chunksMap),
    moduleTags: tokensMap.moduleTags.join('\n'),
    nomoduleTags: tokensMap.nomoduleTags.join('\n'),
    splashIconURL: tokensMap.splashIconURL,
  };
}

/**
 * @param {BuildTemplateTokensStringMap} tokensStringMap
 * @return {string}
 * */
function templatesInjectTokens(tokensStringMap) {
  const templateContent = fs
    .readFileSync(TEMPLATE_PATH)
    .toString();

  return Object
    .entries(tokensStringMap)
    .reduce((result, [name, value]) => {
      return result.replace(`{{${name}}}`, value);
    }, templateContent);
}

/**
 * @param {string} html
 * @return {void}
 * */
function templatesThrowIfUnusedTokensFound(html) {
  const matches = /{{(\w+)}}/i.exec(html);
  if (matches) {
    const tokens = matches
      .slice(1)
      .map((token) => `"${token}"`)
      .join(', ');

    throw new Error(`Unused HTML token(s): ${tokens}`);
  }
}
