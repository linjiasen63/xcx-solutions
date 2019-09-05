/**
 * 客户端原生请求操作方法增强
 */

import * as nativeHelper from './native.js';

let reqBasePath = ''; // 请求基础路径
let logger = null; // 日志输出器

// ////////////////////////////////////////////////////////////
// 配置请求库的方法
export const _setReqBasePath = function(path) {
  reqBasePath = path;
};

export const _setLogger = function(customLogger) {
  logger = customLogger || console;
};


// ////////////////////////////////////////////////////////////
// 
export const showLoading = nativeHelper.showLoading;
export const hideLoading = nativeHelper.hideLoading;
export const showModal = nativeHelper.showModal;

const showAlert = function (content) {
  return showModal({
    title: '提示', 
    content,
    showCancel: false,
  });
};

export const nativeRequest = nativeHelper.requestPro;

export const REQ_FAIL = -10000; // 请求失败
export const REQ_NOT_NETWORK = - 10001; // 没有网络或网络速度太差

export const handleError = function(err) {
  if (!err instanceof Error) {
    return;
  }

  switch(true) {
    case err.code == REQ_FAI: // 请求失败
    case err.code == REQ_NOT_NETWORK: // 网络错误
      showAlert(err.msg);
      break;
    default:
      logger.error('前端逻辑出现', err);
      break;
  }
};

export const request = function (method = 'GET', path, data, config) {
  const url = reqBasePath + path;
  return nativeRequest(url, data, config)
    .then((result) => {
      let msg = '';
      switch (result.statusCode) {
        case 200: // 请求处理成功
          return result.data;
          break;
        case 404:
          msg = '请求接口不存在';
          break;
        case 500:
          msg = '服务器处理错误';
          break;
        default: // 未知错误
          msg = `未知错误（错误码：${result.statusCode}）`;
          break;
      };
      const err = new Error();
      err.code = REQ_FAIL;
      err.msg = msg;
      throw err;
    })
    .catch((reason) => {
      if (!reason || reason.code !== REQ_FAIL) {
        // 非服务器造成，可能是由于网络错误造成
        err = new Error();
        err.code = REQ_NOT_NETWORK;
        err.msg = '请检查网络是否可用';
      }
      logger.error('api请求发生错误：', reason);
      throw reason;
    });
};

export const get = function(path, data, config) {
  return request('GET', path, data, config);
};

export const post = function(path, data, config) {
  return request('POST', path, data, config);
};

export const put = function(path, data, config) {
  return request('PUT', path, data, config);
};

export const del = function(path, data, config) {
  return request('DELETE', path, data, config);
};