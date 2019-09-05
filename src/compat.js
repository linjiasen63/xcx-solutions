const compat = null;

/**
 * @override 获取兼容相关信息
 * @params isReGet 是否重新获取
 */
export const getParams = function(isReGet = false) {
  if (!isReGet && compat) return compat;

  return {};
};
