#!/usr/bin/env node

/*
 * @Author: wy
 * @Date: 2024-01-02 13:55:01
 * @LastEditors: wy
 * @LastEditTime: 2024-01-08 15:00:03
 * @FilePath: /笔记/web-cli/wy-build/bin/index.js
 * @Description:
 */

checkDebug();
const { program } = require('commander');
const pkg = require('../package.json');
const checkNode = require('../lib/checkNode');
const startServer = require('../lib/start/startServer');
const buildServer = require('../lib/build/build');

const MINI_NODE_VERSION = '8.9.0';

function checkDebug() {
  if (process.argv.includes('--debug') || process.argv.includes('-d')) {
    process.env.LOG_LEVEL = 'verbose';
  } else {
    process.env.LOG_LEVEL = 'info';
  }
}

(async () => {
  try {
    if (!checkNode(MINI_NODE_VERSION)) {
      throw new Error('please update node version >=' + MINI_NODE_VERSION);
    }

    // 设置版本号
    program.version(pkg.version);

    program
      .command('start')
      .option('-c, --config <config>', '配置文件路径')
      .option('--custom-webpack-path <customWebpackPath>', '自定义webpack路径')
      .description('start server')
      .allowUnknownOption()
      .action(startServer);

    program
      .command('build')
      .option('-c, --config <config>', '配置文件路径')
      .option('--custom-webpack-path <customWebpackPath>', '自定义webpack路径')
      .description('build server')
      .allowUnknownOption()
      .action(buildServer);

    program.option('-d, --debug', '开启调试模式');
    // 这里设置LOG_LEVEL太迟了，会导致LOG_LEVEL在startServer里面的watch监听，打印不出verbose信息
    // .hook('preAction', (thisCommand, actionCommand) => {
    //   const { debug = false } = actionCommand.optsWithGlobals();

    //   if (debug) {
    //     process.env.LOG_LEVEL = 'verbose';
    //   } else {
    //     process.env.LOG_LEVEL = 'info';
    //   }
    // });

    program.parse(process.argv);
  } catch (e) {
    console.log(e.message);
  }
})();
