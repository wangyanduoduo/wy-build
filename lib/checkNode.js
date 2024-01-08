/*
 * @Author: wy
 * @Date: 2024-01-02 14:03:19
 * @LastEditors: wy
 * @LastEditTime: 2024-01-02 14:10:12
 * @FilePath: /笔记/web-cli/wy-build/lib/checkNode.js
 * @Description:
 */
const semver = require('semver');

module.exports = function (minNodeVersion) {
  const currentVersion = semver.valid(semver.coerce(process.version));
  return semver.satisfies(currentVersion, '>=' + minNodeVersion);
};
