#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
// ^ current script usage intended for local development only
import consola from 'consola';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { templatesRender } from '../utils/templates.js';
import { configGet } from '../config/index.js';
import { buildGetParams } from '../params.js';
import { PORT, HOST } from '../constants.js';

const console = consola.withTag('dev');

async function build() {
  try {
    const { modern, analyze } = buildGetParams();
    const config = await configGet({
      production: false,
      modern,
      analyze,
    });
    const compiler = webpack(config);
    const server = new WebpackDevServer(compiler, config.devServer);
    const fs = compiler.outputFileSystem;
    /**
     * @param {string} html
     * @return {Promise<null|Error>}
     * */
    const writeHTML = (html) => {
      return new Promise((resolve, reject) => {
        const htmlPath = fs.join(compiler.outputPath, 'index.html');
        fs.writeFile(htmlPath, html, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(null);
        });
      });
    };
    compiler.hooks.done.tapAsync(
      'DevDonePlugin',
      /**
       * @param {WebpackStats} stats
       * @param {Function} callback
       */
      async (stats, callback) => {
        const err = await createAndInjectIndexHTML({ writeHTML, stats });
        callback(err);
      },
    );
    server.listen(PORT, HOST, () => {
      console.info(`https://${HOST}:${PORT}`);
    });
  }
  catch (err) {
    console.warn('Compilation failed');
    console.error(err);
  }
}

/**
 * @param {Object} params
 * @param {function(html: string): Promise<null|Error>} params.writeHTML
 * @param {WebpackStats} params.stats
 * @return {Promise<null|Error>}
 * */
async function createAndInjectIndexHTML(params) {
  const {
    writeHTML,
    stats,
  } = params;
  if (stats.hasErrors()) {
    return null;
  }
  try {
    console.info('Compiling template...');
    const html = templatesRender({
      production: false,
      statsList: [stats],
    });
    await writeHTML(html);
    console.success('Template compiled successfully');
    return null;
  }
  catch (err) {
    console.error(err);
    return err;
  }
}

(async function() {
  await build();
}());
