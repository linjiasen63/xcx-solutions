const config = require('./config.js');

const {
  ENV,
  REQ_HOST
} = config;

console.log('config', config);

const constant = {
  ENV,

  REQ_HOST,
};

switch (ENV) {
  case 'devp': // 开发环境
    initDevpConstant();
    break;

  case 'prod': // 正式环境
    initProdConstant();
    break;

  default:
    break;
}

function initDevpConstant() {
}

function initProdConstant() {
}

export default constant;