import * as asyncHelper from './async/index.js';

/**
 * @override 原生客户端方法封装
 */

// 页面跳转方法：switchTab、reLaunch、redirectTo、navigateTo、navigateBack

export const request = asyncHelper.promisify(wx.request);
export const downloadFile = asyncHelper.promisify(wx.downloadFile);
export const uploadFile = asyncHelper.promisify(wx.uploadFile);
export const sendSocketMessage = asyncHelper.promisify(wx.sendSocketMessage);
export const login = asyncHelper.promisify(wx.login);
export const showModal = asyncHelper.promisify(wx.showModal);

export const showLoading = function (title = '加载中...', mask = true) {
  wx.showLoading({
    title,
    mask,
  });
};

export const hideLoading = function (delay = 0) {
  if (delay > 0) {
    setTimeout(() => {
      hideLoading(0);
    }, delay)
  } else {
    wx.hideLoading();
  }
};

export const requestPro = function(url, data, config) {
  const { header, dataType, responseType } = config;
  return request({
    ur, //仅为示例，并非真实的接口地址
    data,
    header: header || {
      'content-type': 'application/json',
    },
    dataType: dataType || 'json',
    responseType: responseType || 'text',
  });
};

export const loginPro = function() {
  return login({
    setTimeout: 30000,
  });
};