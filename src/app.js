import constant from './constant.js';
import initLogger from './logger';
import * as deviceHelper from './device.js';
import * as compatHelper from './compat.js';
import initRequest from './request/index.js';
import utils from './utils/index.js';

// 控制日志输出级别
const logLevel = constant.ENV === 'prod' ? 'warn' : 'log';
const logger = initLogger(logLevel);
const request = initRequest(constant, logger);


const appConfig = {
  // 基础类库 ////////////////////////////////////////
  constant: constant, // 运行环境常量（不建议修改此对象）
  logger: logger, // 日志辅助工具
  request: request, // 请求辅助工具
  deviceHelper: deviceHelper, // 设备参数辅助工具
  device: null,
  compatHelper: compatHelper, // 环境兼容辅助工具
  compact: null,
  utils: utils, // 辅助工具

  // 全局数据 ////////////////////////////////////////
  // 全局级别数据存储库
  globalData: {},

  // 生命周期 ////////////////////////////////////////
  onLaunch: function () {
    this.initEnv();
  },

  onError: function(err) {
    logger.error('全局捕获错误：', err);
  },

  onPageNoFound: function (e) {
    logger.error('对应页面不存在：', e);
  },

  // ////////////////////////////////////////
  // 初始化操作环境
  initEnv: function () {
    // 手动初始化设备信息
    this.device = deviceHelper.getParams(true, logger); 
    // 手动初始化兼容信息
    this.compac = compatHelper.getParams(this.device, true, logger);
  },

};

App(appConfig)