// import { promisifyAll } from 'miniprogram-api-promise';

import constant from './constant.js';
import initLogger from './logger';
import * as deviceHelper from './device.js';
import * as compatHelper from './compat.js';
import initRequest from './request/index.js';
import utils from './utils/index.js';

const nativeFuncPro = {};
// promisifyAll(wx, nativeFuncPro);

// 控制日志输出级别
const logLevel = constant.ENV === 'prod' ? 'warn' : 'log';
const logger = initLogger(logLevel);
const request = initRequest(constant, logger);


const config = {
  // ########################################
  // 环境常量（请谨慎修改）
  constant,
  // 日志工具
  logger, 
  // 请求工具
  request,
  // 运行环境
  deviceHelper,
  device: null,
  // 兼容工具
  compatHelper,
  compact: null,
  // 辅助工具
  utils,
  // promise化的客户端api
  nativeFuncPro,

  // ########################################
  // 数据缓存区
  globalData: {},

  // ########################################
  // 生命周期勾子
  onLaunch: function () {
    this.initEnv();
  },

  onError: function(err) {
    logger.error('全局捕获错误：', err);
  },

  onPageNoFound: function (err) {
    logger.error('对应页面不存在：', err);
  },

  // ########################################
  // 初始化操作环境
  initEnv: function () {
    // 手动初始化设备信息
    this.device = deviceHelper.init(true, logger); 
    // 手动初始化兼容信息
    this.compac = compatHelper.init(this.device, true, logger);
  },

};

App(config)