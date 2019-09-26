let compat = null;

/**
 * @override 获取兼容相关信息
 * @params isReGet 是否重新获取
 */
export const getParams = function(device, isReGet = false, logger = console) {
  if (!isReGet && compat) return compat;

  compat = {};

  return compat;
};
