import fs from 'fs';
import rimraf from 'rimraf';

/**
 * @param {string} directory
 * @return {Promise<void|Error>}
 * */
export function fsClearDir(directory) {
  return new Promise((resolve, reject) => {
    rimraf(directory, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

/**
 * @param {string} directory
 * @return {Promise<string|Error>}
 * */
export function fsMakeDir(directory) {
  return fs.promises.mkdir(directory, { recursive: true });
}

/**
 * @param {string} directory
 * @return {Promise<void|Error>}
 * */
export function fsMakeOrClearDir(directory) {
  return fsClearDir(directory)
    .then(() => {
      return fsMakeDir(directory);
    });
}

/**
 * @param {string} filePath
 * @param {string} content
 * @return {Promise<void>}
 * */
export function fsWriteFile(filePath, content) {
  return fs.promises.writeFile(filePath, content);
}

/**
 * @param {string} filePath
 * @return {Promise<string|Error>}
 * */
export function fsReadFile(filePath) {
  return fs.promises.readFile(filePath, { encoding: 'utf-8' });
}
