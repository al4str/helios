/**
 * @typedef {import("webpack").webpack} Webpack
 * */

/**
 * @typedef {import("webpack").webpack.Configuration} WebpackConfig
 * */

/**
 * @typedef {import("webpack").webpack.Compiler} WebpackCompiler
 * */

/**
 * @typedef {import("webpack").webpack.Compilation} WebpackCompilation
 * */

/**
 * @typedef {import("webpack").webpack.Stats} WebpackStats
 * */

/**
 * @typedef {import("webpack").webpack.StatsCompilation} WebpackStatsOutput
 * */

/**
 * @typedef {Object} BuildParams
 * @property {boolean} production
 * @property {boolean} modern
 * @property {boolean} analyze
 * */

/**
 * @typedef {Object} BuildConstants
 * @property {string} ROOT_DIR
 * @property {string} DIST_DIR
 * @property {string} LEGACY_DIR
 * @property {string} MODERN_DIR
 * @property {string} VERSION
 * @property {number} PORT
 * @property {string} HOST
 * @property {"local"|"prod"} DEPLOY_ENV
 * @property {string} PROXY_URL
 * @property {string} PROXY_TARGET_URL
 * @property {string} SSL_KEY
 * @property {string} SSL_CERT
 * @property {string} BRAND_GUID_FLAT
 * @property {Array<BuildMetaItem>} META_ITEMS
 * @property {string} ASSETS_VAR_NAME
 * @property {string} ROUTES_CHUNKS_VAR_NAME
 * @property {string} PUBLIC_PATH
 * @property {string} MAIN_CHUNK_GROUP
 * */

/**
 * @typedef {Object} BuildMetaItem
 * @property {string} originalPath
 * @property {Object<string, string>} attributes
 * */

/**
 * @typedef {Object} BuildTagItem
 * @property {string} tagName
 * @property {Object<string, string|boolean>} attributes
 * @property {boolean} voidTag
 * */

/**
 * @typedef {string|"prefetch"|"preload"|"modulepreload"} BuildTagHint
 * */

/**
 * @typedef {Object} BuildTemplateTokensMap
 * @property {Array<string>} metaTags
 * @property {Array<string>} prefetchTags
 * @property {Array<string>} preloadTags
 * @property {Array<string>} styleTags
 * @property {Record<string, string>} assetsMap
 * @property {Record<string, Array<string>>} chunksMap
 * @property {Array<string>} moduleTags
 * @property {Array<string>} nomoduleTags
 * @property {string} splashIconURL
 * */

/**
 * @typedef {"metaTags"|"prefetchTags"|"preloadTags"
 *   |"styleTags"|"assetsMap"|"chunksMap"|"moduleTags"
 *   |"nomoduleTags"|"splashIconURL"} BuildTemplateTokenName
 * */

/**
 * @typedef {Record<BuildTemplateTokenName, string>} BuildTemplateTokensStringMap
 * */

/**
 * @typedef {Object} BuildTagItemsGrouped
 * @property {Array<BuildTagItem>} meta
 * @property {Array<BuildTagItem>} prefetch
 * @property {Array<BuildTagItem>} preload
 * @property {Array<BuildTagItem>} style
 * @property {Array<BuildTagItem>} module
 * @property {Array<BuildTagItem>} nomodule
 * */

/**
 * @typedef {Record<string, Array<string>>} BuildChunkGroups
 * */

/**
 * @typedef {Object} BuildAssetItem
 * @property {string} originalPath
 * @property {string} outputPath
 * */

/**
 * @typedef {Object} BuildCompileResults
 * @property {null|Error} err
 * @property {WebpackStats} stats
 * */

/**
 * @typedef {Object} BuildTargetsConfig
 * @property {Array<string>} modern
 * @property {Array<string>} legacy
 * */
