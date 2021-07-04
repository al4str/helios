import webpack from 'webpack';
import { PACKAGE_VERSION } from '../../constants.js';

const pluginName = 'EmitJsonWebpackPlugin';

class EmitJsonWebpackPlugin {
  /**
   * @param {Object} params
   * @param {string} params.path
   * @param {Object} params.data
   * */
  constructor(params) {
    this.onEmit = this.onEmit.bind(this);
    this.path = params.path;
    this.data = params.data;
  }
  onEmit(compilation) {
    const filePath = this.path;
    const fileData = this.data;
    const fileContent = JSON.stringify(fileData, null, 2);
    compilation.emitAsset(filePath, new webpack.sources.RawSource(fileContent));
  }
  apply(compiler) {
    const hookOptions = {
      name: pluginName,
      stage: Infinity,
    };
    compiler.hooks.thisCompilation.tap(hookOptions, (compilation) => {
      compilation.hooks.processAssets.tap(hookOptions, () => this.onEmit(compilation));
    });
  }
}

export async function configGetPluginRelease() {
  return new EmitJsonWebpackPlugin({
    path: './meta.json',
    data: {
      version: PACKAGE_VERSION,
    },
  });
}
