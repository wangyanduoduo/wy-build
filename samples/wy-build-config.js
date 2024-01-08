/*
 * @Author: wy
 * @Date: 2024-01-04 14:15:27
 * @LastEditors: wy
 * @LastEditTime: 2024-01-08 14:54:34
 * @FilePath: /笔记/web-cli/wy-build/samples/wy-build-config.js
 * @Description:
 */
module.exports = {
  entry: 'src/index.js',
  output: 'dist',

  plugins: function () {
    return [
      // [
      //   'wy-build-test-plugin',
      //   {
      //     a: 1,
      //     b: 1,
      //   },
      // ],
      [
        './plugins/wy-build-plugin',
        {
          a: 2,
          b: 2,
        },
      ],
      function () {
        console.log('this is none name plugin');
      },
    ];
  },

  // plugins: [
  //   'wy-build-test-plugin',
  //   [
  //     'wy-build-test-plugin',
  //     {
  //       a: 1,
  //       b: 1,
  //     },
  //   ],
  //   [
  //     './plugins/wy-build-plugin',
  //     {
  //       a: 2,
  //       b: 2,
  //     },
  //   ],
  // ],
  hooks: [
    // [
    //   'start',
    //   function (context) {
    //     console.log('start', context);
    //   },
    // ],
    // [
    //   'configResolved',
    //   function (context) {
    //     console.log('configResolved', context);
    //   },
    // ],
    [
      'testPlugin',
      (context) => {
        console.log('test-plugin', context.webpackConfig.toConfig());
      },
    ],
  ],
};
