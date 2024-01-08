/*
 * @Author: wy
 * @Date: 2024-01-04 18:01:44
 * @LastEditors: wy
 * @LastEditTime: 2024-01-08 14:22:06
 * @FilePath: /笔记/web-cli/wy-build/samples/plugins/wy-build-plugin/index.js
 * @Description:
 */
module.exports = function (api, options) {
  const { getWebpackConfig, getValue, emitHooks } = api;

  const webpackConfig = getWebpackConfig();
  webpackConfig
    // Interact with entry points
    .entry('index')
    .add('src/index.js')
    .end()
    // Modify output settings
    .output.path('dist')
    .filename('[name].bundle.js');
  const value = getValue('name');

  emitHooks('testPlugin');
  console.log('custom wy-build-plugin-webpackConfig', value);
};
