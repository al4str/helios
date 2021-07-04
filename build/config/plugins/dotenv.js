import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import webpack from 'webpack';
import { ROOT_DIR, PACKAGE_VERSION } from '../../constants.js';

const envPath = path.join(ROOT_DIR, '.env');
const envRaw = fs.readFileSync(envPath);
const envRawDefinitions = dotenv.parse(envRaw);
const envDefinitions = Object.entries(envRawDefinitions);

const definitions = [
  ['NODE_ENV', process.env.NODE_ENV],
  ['BROWSERSLIST_ENV', process.env.BROWSERSLIST_ENV],
  ['PACKAGE_VERSION', PACKAGE_VERSION],
]
  .concat(envDefinitions)
  .reduce((result, [key, value]) => {
    result[`process.env.${key}`] = JSON.stringify(value);
    return result;
  }, {});

/**
 * @param {BuildParams} params
 * */
export async function configGetPluginDotenv(params) {
  definitions['process.env.BUILD_MODERNITY'] = JSON.stringify(params.modern
    ? 'modern'
    : 'legacy');

  return new webpack.DefinePlugin(definitions);
}
