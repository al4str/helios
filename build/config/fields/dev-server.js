import fs from 'fs';
import { DIST_DIR, PORT, HOST, SSL_KEY, SSL_CERT, PUBLIC_PATH }
  from '../../constants.js';

/**
 * @param {BuildParams} params
 * */
export async function configGetDevServer(params) {
  if (params.production) {
    return {};
  }
  return {
    port: PORT,
    host: HOST,
    https: {
      key: fs.readFileSync(SSL_KEY),
      cert: fs.readFileSync(SSL_CERT),
    },
    devMiddleware: {
      publicPath: PUBLIC_PATH,
      index: 'index.html',
    },
    static: [
      DIST_DIR,
    ],
    firewall: false,
  };
}
