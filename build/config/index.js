import {
  configGetMode,
  configGetTarget,
  configGetStats,
  configGetEntry,
  configGetDevtool,
  configGetOutput,
  configGetResolve,
  configGetOptimization,
  configGetDevServer,
} from './fields/index.js';
import { configGetLoaders } from './loaders/index.js';
import { configGetPlugins } from './plugins/index.js';

/**
 * @param {BuildParams} params
 * @return {Promise<Partial<WebpackConfig>>}
 * */
export async function configGet(params) {
  return {
    mode: await configGetMode(params),
    target: await configGetTarget(params),
    stats: await configGetStats(params),
    entry: await configGetEntry(params),
    devtool: await configGetDevtool(params),
    devServer: await configGetDevServer(params),
    output: await configGetOutput(params),
    resolve: await configGetResolve(params),
    optimization: await configGetOptimization(params),
    module: {
      rules: await configGetLoaders(params),
    },
    plugins: await configGetPlugins(params),
  };
}
