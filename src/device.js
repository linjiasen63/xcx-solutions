let device = null;

/**
 * @override 获取设备相关信息
 * @params isReGet 是否重新获取
 */
export const getParams = function (isReGet = false, logger = console) {
  if (!isReGet && device) return device;

  try {
    device = wx.getSystemInfoSync();
  } catch (e) {
    logger.error('getSystemInfoSync fail:', e)
    device = {};
  }
  return device;
};

