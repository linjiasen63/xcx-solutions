import * as commonFns from './common.js';

let reqBasePATH = '';


export default function (constant, logger) {
  reqBasePATH = constant.REQ_HOST + constant.REQ_PATH_PREFIX + constant.REQ_VERSION;

  commonFns._setReqBasePath(reqBasePATH);
  commonFns._setLogger(logger);

  return commonFns;
};