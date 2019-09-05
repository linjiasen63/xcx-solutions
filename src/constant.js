import config from './config';

let { ENV, REQ_HOST } = config;

const constant = {
  ENV,

  REQ_HOST: REQ_HOST,
  REQ_VERSION: '',
  REQ_PATH_PREFIX: '',
};

switch(EVN) {
  case 'devp': // 开发环境常量
    initDevpConstant();
  break;

  case 'prod': // 正式环境常量
    initDevpConstant();
  break;

  default: 
  break;
}

function initDevpConstant() {
  constant.REQ_VERSION = '';
  constant.REQ_PATH_PREFIX = '';
}

function initProdConstant() {
  constant.REQ_VERSION = '';
  constant.REQ_PATH_PREFIX = '';
}

export default constant;