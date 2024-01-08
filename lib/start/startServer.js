/*
 * @Author: wy
 * @Date: 2024-01-02 14:39:44
 * @LastEditors: wy
 * @LastEditTime: 2024-01-08 15:24:42
 * @FilePath: /笔记/web-cli/wy-build/lib/start/startServer.js
 * @Description:
 */
const chokidar = require('chokidar');
const path = require('path');
const cp = require('child_process'); // 子进程
const { getConfigFile } = require('../utils/index');
const npmlog = require('../utils/logs');

let child = null;

function runServer(args) {
  // cp.exec(
  //   `node ${path.resolve(__dirname, './devServer.js')} --force`,
  //   (err, stdout) => {
  //     if (!err) {
  //       console.log(stdout);
  //     } else {
  //       console.error(err);
  //     }
  //   }
  // );

  // 只能接收，不能传递数据
  // const child = cp.spawn('node', [
  //   path.resolve(__dirname, './devServer.js'),
  //   '--force',
  // ]);
  // child.stdout.on('data', (data) => {
  //   console.log('stdout' + data.toString());
  // });

  // child.stderr.on('data', (data) => {
  //   console.log('stderr' + data.toString());
  // });

  // child.stdout.on('close', (code) => {
  //   console.log('close' + code.toString());
  // });

  // 利用fork 传递数据

  const { config = '', customWebpackPath = '' } = args || {};

  child = cp.fork(path.resolve(__dirname, './devServer.js'), [
    '--port 8080',
    '--config ' + config,
    '--custom-webpack-path ' + customWebpackPath,
  ]);
  child.on('exit', (code) => {
    // 子进程退出时，传递的是1
    if (code) {
      // 子进程退出，同时退出主进程
      process.exit(code);
    }
  });
  // child.on('message', (data) => {
  //   // 接受子进程的消息
  //   console.log('the message from child process');
  //   console.log(data);
  // });
  // // 向子进程发送消息
  // child.send('hi child process');
}

function onChange() {
  npmlog.verbose('---------change-------');
  child.kill(); // 杀死子进程
  runServer(); // 重启子进程
}

function runWatcher() {
  const configPath = getConfigFile();
  chokidar
    .watch(configPath)
    .on('change', onChange)
    .on('error', (err) => {
      console.error('file watch error', err);
      process.exit(1);
    });
}
module.exports = function (opts, cmd) {
  runServer(opts);
  // 监听文件改变
  runWatcher();
};
