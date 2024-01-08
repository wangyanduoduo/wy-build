/*
 * @Author: wy
 * @Date: 2024-01-02 16:27:53
 * @LastEditors: wy
 * @LastEditTime: 2024-01-08 15:18:01
 * @FilePath: /笔记/web-cli/wy-build/lib/start/devServer.js
 * @Description:
 */

// process.on('message', (data) => {
//   console.log('the message from main process');
//   console.log(data);
// });

// process.send('hello main process');
const DEFAULT_PORT = 8000;
const params = process.argv.slice(2);
const paramObj = {};
const detect = require('detect-port');
const inquirer = require('inquirer');
const Service = require('../service');

(async () => {
  params.forEach((item) => {
    const paramsArr = item.split(' ');
    paramObj[paramsArr[0].replace('--', '')] = paramsArr[1];
  });

  let config = paramObj['config'] || '';
  let defaultPort = paramObj['port'] || DEFAULT_PORT;
  let customWebpackPath = paramObj['custom-webpack-path'] || '';

  defaultPort = parseInt(defaultPort, 10);

  try {
    const newPort = await detect(defaultPort);
    if (defaultPort !== newPort) {
      const { answer } = await inquirer.prompt({
        type: 'confirm',
        name: 'answer',
        message: `${defaultPort}被占用, 是否启用新的端口号${newPort}?`,
      });

      if (!answer) {
        process.exit(1);
      }
    }

    const args = {
      port: newPort,
      config,
      customWebpackPath,
    };
    process.env.NODE_ENV = 'development';
    const service = new Service(args);
    service.start();
  } catch (e) {
    console.error(e);
  }
})();
