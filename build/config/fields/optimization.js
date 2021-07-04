import Terser from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const FRAMEWORK_PACKAGES = [
  'classnames',
  'history',
  'mini-create-react-context',
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
  'react-is',
  'scheduler',
].join('|');

const FRAMEWORK_REG_EXP = new RegExp(
  `node_modules/(${FRAMEWORK_PACKAGES})`,
  'i',
);

/**
 * @param {Object} module
 * @param {string} module.type
 * @return {boolean}
 * */
function isNotCssModule(module) {
  return module.type !== 'css/mini-extract';
}

/**
 * @param {BuildParams} params
 * @return {Partial<webpack.Configuration.optimization>}
 * */
export async function configGetOptimization(params) {
  if (params.production) {
    const terser = new Terser({
      terserOptions: {
        safari10: !params.modern,
      },
    });
    const cssMinimizer = new CssMinimizerPlugin();

    return {
      realContentHash: true,
      minimize: true,
      minimizer: [
        '...',
        terser,
        cssMinimizer,
      ],
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          defaultVendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: FRAMEWORK_REG_EXP,
            priority: 15,
            enforce: true,
          },
          libs: {
            test(module) {
              return !isNotCssModule(module)
                && module.size() > 100000
                && /node_modules/.test(module.identifier());
            },
            name(module) {
              const moduleFileName = module
                .identifier()
                .split('/')
                .reduceRight((item) => item)
                .replace(/\.js$/, '');

              return `libs.${moduleFileName}`;
            },
            priority: 10,
            minChunks: 1,
          },
          commons: {
            name: 'commons',
            minChunks: 5,
            priority: 5,
          },
        },
      },
    };
  }

  return {
    realContentHash: false,
  };
}
