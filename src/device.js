const device = null;

/**
 * @override 获取设备相关信息
 * @params isReGet 是否重新获取
 */
export const getParams = function(isReGet = false) {
  if (!isReGet && device) return device;

  try {
    const info = wx.getSystemInfoSync()
    device = info;
  } catch (e) {
    return {}
  }
};

