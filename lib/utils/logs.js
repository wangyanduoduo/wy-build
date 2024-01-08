/*
 * @Author: wy
 * @Date: 2024-01-04 10:07:32
 * @LastEditors: wy
 * @LastEditTime: 2024-01-04 10:32:41
 * @FilePath: /笔记/web-cli/wy-build/lib/utils/logs.js
 * @Description:
 */
const npmlog = require('npmlog');

const LEVELS = ['verbose', 'info', 'error', 'warn'];

const envLogLevel = process.env.LOG_LEVEL;

const logLevel = LEVELS.includes(envLogLevel) ? envLogLevel : 'info';

npmlog.level = logLevel;

module.exports = npmlog;
