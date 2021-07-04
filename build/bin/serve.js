#!/usr/bin/env node
import path from 'path';
import { serverCreate } from '../utils/server.js';
import { DIST_DIR, PORT, HOST, SSL_KEY, SSL_CERT } from '../constants.js';

async function serve() {
  const indexHtml = path.join(DIST_DIR, 'index.html');
  const indexMiddleware = (app) => {
    app.get('*', (_, res) => {
      res.sendFile(indexHtml);
    });
  };
  const run = serverCreate({
    host: HOST,
    port: PORT,
    staticDir: DIST_DIR,
    sslCert: SSL_CERT,
    sslKey: SSL_KEY,
    middlewares: [
      indexMiddleware,
    ],
  });
  await run();
}

(async function() {
  await serve();
}());
