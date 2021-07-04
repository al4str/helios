import { configGetPluginDotenv } from './dotenv.js';
import { configGetPluginNotifier } from './notifier.js';
import { configGetPluginHMR } from './hmr.js';
import { configGetPluginCSS } from './css.js';
import { configGetPluginAnalyze } from './analyze.js';
import { configGetPluginStylelint } from './stylelint.js';
import { configGetPluginBar } from './bar.js';
import { configGetPluginRelease } from './release.js';

const plugins = [
  configGetPluginNotifier,
  configGetPluginBar,
  configGetPluginDotenv,
  configGetPluginStylelint,
  configGetPluginHMR,
  configGetPluginCSS,
  configGetPluginAnalyze,
  configGetPluginRelease,
];

/**
 * @param {BuildParams} params
 * */
export async function configGetPlugins(params) {
  const results = await Promise.all(plugins.map((plugin) => {
    return plugin(params);
  }));

  return results.filter(Boolean);
}
