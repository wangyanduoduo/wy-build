/*
 * @Author: wy
 * @Date: 2024-01-03 11:12:34
 * @LastEditors: wy
 * @LastEditTime: 2024-01-08 15:44:48
 * @FilePath: /笔记/web-cli/wy-build/lib/service/index.js
 * @Description:
 */
const path = require('path');
const fs = require('fs');
const Config = require('webpack-chain');
const npmlog = require('../utils/logs');
const InitPlugin = require('../../plugins/wy-init-plugin/index');
const { getConfigFile, loadModule } = require('../utils/index');
const { HOOK_START, HOOK_PLUGIN } = require('./const');
const HOOK_KEYS = [HOOK_START, HOOK_PLUGIN];
const buildInitPlugins = [InitPlugin];
class Service {
  constructor(options) {
    this.args = options;
    this.config = {};
    this.hooks = {};
    this.plugins = [];
    this.dir = process.cwd();
    this.webpackConfig = null;
    this.internalValue = {}; // 插件之间相互提供数据
    this.webpack = null;
  }

  async start() {
    await this.resolveConfig();
    await this.registerHooks();

    await this.emitHooks(HOOK_START);
    await this.registerPlugins();
    await this.runPlugin();
    await this.initWebpack();
  }

  initWebpack = async () => {
    // 自定义的webpack路径
    const { customWebpackPath } = this.args;
    if (customWebpackPath) {
      if (fs.existsSync(customWebpackPath)) {
        let p = customWebpackPath;
        if (!path.isAbsolute(p)) {
          p = path.resolve(p);
        }
        this.webpack = require.resolve(p);
      }
    } else {
      // 项目中安装的webpack 路径
      this.webpack = require.resolve('webpack', {
        paths: [path.resolve(process.cwd(), 'node_modules')],
      });
    }
  };
  async resolveConfig() {
    const { config } = this.args;
    let configFilePath = '';
    if (config) {
      if (path.isAbsolute(config)) {
        configFilePath = config;
      } else {
        configFilePath = path.resolve(config);
      }
    } else {
      configFilePath = getConfigFile(this.dir);
    }

    if (configFilePath && fs.existsSync(configFilePath)) {
      this.config = await loadModule(configFilePath);

      npmlog.verbose('this.config', this.config);
    } else {
      console.log('配置文件不存在，程序终止');
      process.exit(1);
    }

    this.webpackConfig = new Config();
  }

  // 注册hooks
  async registerHooks() {
    const { hooks = [] } = this.config;

    if (hooks && hooks.length > 0) {
      for (const hook of hooks) {
        const [key, fn] = hook;

        if (key && fn && HOOK_KEYS.includes(key) && typeof key === 'string') {
          if (typeof fn == 'function') {
            const existHook = this.hooks[key];
            if (!existHook) {
              this.hooks[key] = [];
            }
            this.hooks[key].push(fn);
          } else if (typeof fn == 'string') {
            const newFn = await loadModule(fn);

            if (newFn) {
              const existHook = this.hooks[key];

              if (!existHook) {
                this.hooks[key] = [];
              }
              this.hooks[key].push(newFn);
            }
          }
        }
      }
    }
  }

  emitHooks = async (key) => {
    const hooks = this.hooks[key];
    if (hooks) {
      for (const fn of hooks) {
        try {
          await fn(this);
        } catch (e) {
          npmlog.error(e);
        }
      }
    }
  };

  async registerPlugins() {
    let { plugins } = this.config;
    for (let plugin of buildInitPlugins) {
      this.plugins.push({
        mod: plugin,
      });
    }
    if (plugins) {
      if (typeof plugins === 'function') {
        plugins = plugins();
      }
      if (Array.isArray(plugins)) {
        for (const plugin of plugins) {
          if (typeof plugin === 'string') {
            const mod = await loadModule(plugin);
            this.plugins.push({
              mod,
            });
          } else if (Array.isArray(plugin)) {
            const [modPath, params] = plugin;
            const mod = await loadModule(modPath);
            this.plugins.push({
              mod,
              params,
            });
          } else if (typeof plugin === 'function') {
            this.plugins.push({
              mod: plugin,
            });
          }
        }
      }
    }
  }

  async runPlugin() {
    for (const plugin of this.plugins) {
      const { mod, params } = plugin;
      if (!mod) {
        continue;
      }
      const API = {
        getWebpackConfig: this.getWebpackConfig,
        emitHooks: this.emitHooks, // 提供插件自定义hook功能
        setValue: this.setValue,
        getValue: this.getValue,
        log: npmlog,
      };
      const options = {
        ...params,
      };

      await mod(API, options);
    }
  }

  getWebpackConfig = () => {
    return this.webpackConfig;
  };

  setValue = (key, value) => {
    this.internalValue[key] = value;
  };
  getValue = (key) => {
    return this.internalValue[key];
  };
}

module.exports = Service;
