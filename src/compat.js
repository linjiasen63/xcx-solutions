let compat = null;
let logger = null;

/**
 * @override 获取兼容相关信息
 * @params isReGet 是否重新获取
 */
export const init = function(device, isReGet = false, vLogger = console) {
  if (!isReGet && compat) return compat;
  !logger && (logger = vLogger);

  compat = {};

  return compat;
};
