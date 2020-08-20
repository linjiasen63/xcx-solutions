let device = null;

let logger = null;

const deviceParams = {};

/**
 * @override 获取设备信息
 * @params isReGet 是否重新获取
 * @params logger 日志输出工具
 */
export const init = function (isReGet = false, vLogger = console) {
  if (!isReGet && device) return device;
  !logger && (logger = vLogger);

  try {
    device = wx.getSystemInfoSync();
  } catch (e) {
    logger.error('getSystemInfoSync fail:', e)
    device = {};
  }

  handledeviceParams(device);
  return device;
};

export const getDeviceParams = function() {
  logger.log(device);
  logger.log(deviceParams);
  return deviceParams;
}

// 处理设备信息以更多的开发
export const handledeviceParams = function (device) {
  logger.log('device', device);
  const {
    model,
    environment,
  } = device;

  const regexpOfNoHomeIphone = /^(iPhone X)|(iPhone 1\d)\w*/i;
  deviceParams.noHomeIphone = regexpOfNoHomeIphone.test(model);

  deviceParams.qy = environment === 'wxwork';
};

// 判断当前手机是否为没有实体home键的iphone
export const getNoHomeIphone = function () {
  return deviceParams.noHomeIphone;
};

// 判断当前是否运行在企业微信中
export const getQy = function() {
  return deviceParams.qy
};