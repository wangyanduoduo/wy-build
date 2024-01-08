/*
 * @Author: wy
 * @Date: 2024-01-04 10:48:12
 * @LastEditors: wy
 * @LastEditTime: 2024-01-04 17:54:15
 * @FilePath: /笔记/web-cli/wy-build/lib/utils/index.js
 * @Description:
 */
const fg = require('fast-glob');
const path = require('path');
const fs = require('fs');
const DEFAULT_CONFIG_FILE = ['wy-build-config.(json|js|mjs)'];
function getConfigFile({ cwd = process.cwd() } = {}) {
  const [configFile] = fg.sync(DEFAULT_CONFIG_FILE, {
    cwd,
    absolute: true,
  });

  return configFile;
}

async function loadModule(modulePath) {
  let filePath;
  let result = null;
  // 区分是路径还是模块
  if (modulePath.startsWith('/') || modulePath.startsWith('.')) {
    if (path.isAbsolute(modulePath)) {
      filePath = modulePath;
    } else {
      filePath = path.resolve(modulePath);
    }
  } else {
    filePath = modulePath;
  }
  // 让真实项目的node_modules里面的模块，能在hooks中被正确的查找
  filePath = require.resolve(filePath, {
    paths: [path.resolve(process.cwd(), 'node_modules')],
  });

  if (fs.existsSync(filePath)) {
    const isMjs = filePath.endsWith('mjs');
    if (isMjs) {
      result = (await import(filePath)).default;
    } else {
      result = require(filePath);
    }
  }

  return result;
}

module.exports = {
  getConfigFile,
  loadModule,
};
