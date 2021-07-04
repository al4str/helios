import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

export const ROOT_DIR = process.cwd();

const packageInfoRaw = fs.readFileSync(
  path.resolve(ROOT_DIR, 'package.json'),
  { encoding: 'utf-8' },
);
const packageInfo = JSON.parse(packageInfoRaw);

export const PACKAGE_VERSION = packageInfo.version;

export const PACKAGE_NAME = packageInfo.name;

export const DIST_DIR = path.join(ROOT_DIR, 'dist');

export const LEGACY_DIR = path.join(ROOT_DIR, 'dist', 'legacy');

export const MODERN_DIR = path.join(ROOT_DIR, 'dist', 'modern');

export const PORT = process.env.DEV_PORT || '';

export const HOST = process.env.DEV_HOST || '';

/** @type {'local'|'prod'} */
export const DEPLOY_ENV = process.env.DEPLOY_ENV || 'local';

export const SSL_KEY = path.join(ROOT_DIR, 'build', 'ssl', 'privkey.pem');

export const SSL_CERT = path.join(ROOT_DIR, 'build', 'ssl', 'fullchain.pem');

/** @type {Array<BuildMetaItem>} */
export const META_ITEMS = [];

export const INJECTABLE_KEY_ASSETS = '__INJECTABLE_ASSETS__';

export const INJECTABLE_KEY_CHUNKS = '__INJECTABLE_CHUNKS__';

export const PUBLIC_PATH = '/';

export const MAIN_CHUNK_GROUP = 'main';
