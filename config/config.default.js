/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1634136136589_5888';

  // add your middleware config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
      ignoreJson: true,
    },
    domainWhiteList: [ '*' ],
  };

  // 模板编译配置
  config.view = {
    mapping: { '.html': 'ejs' },
  };

  // 数据库配置
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'tally_book',
    },
    app: true,
    agent: false,
  };

  // 鉴权 加密
  config.jwt = {
    secret: 'Zmz',
  };

  // 文件上传 配置
  config.multipart = {
    mode: 'file',
  };

  // 跨域配置
  config.cors = {
    origin: '*', // 允许所有跨域访问
    credentials: true, // 允许 Cookie 跨域跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // add your user config here
  // 全局app config配置变量
  const userConfig = {
    // myAppName: 'egg',
    uploadDir: 'app/public/upload',
  };

  return {
    ...config,
    ...userConfig,
  };
};
