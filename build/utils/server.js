/* eslint-disable import/no-extraneous-dependencies */
// ^ current script usage intended for local development only
import spdy from 'spdy';
import express from 'express';
import compression from 'compression';
import serveStatic from 'serve-static';
import consola from 'consola';
import { fsReadFile } from './fs.js';

const console = consola.withTag('server');

/**
 * @param {Object} params
 * @param {string} params.host
 * @param {number} params.port
 * @param {string} params.staticDir
 * @param {string} params.sslCert
 * @param {string} params.sslKey
 * @param {Array<Function>} [params.middlewares]
 * @return {function(): Promise<void>}
 * */
export function serverCreate(params) {
  const {
    host,
    port,
    staticDir,
    sslCert,
    sslKey,
    middlewares,
  } = params;

  const app = express();

  app.use(compression());

  app.use(serveStatic(staticDir, {
    setHeaders(res, path) {
      if (serveStatic.mime.lookup(path) === 'text/html') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      else {
        res.setHeader('Cache-Control', 'public');
        res.setHeader('Expires', '1y');
      }
    },
  }));

  if (middlewares) {
    middlewares.forEach((applyMiddleware) => {
      applyMiddleware(app);
    });
  }

  return async () => {
    const [
      certificate,
      privateKey,
    ] = await Promise.all([
      fsReadFile(sslCert),
      fsReadFile(sslKey),
    ]);
    const serverOptions = {
      key: privateKey,
      cert: certificate,
    };
    spdy
      .createServer(serverOptions, app)
      .listen(port, host, (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        else {
          console.info(`https://${host}:${port}`);
        }
      });
  };
}
