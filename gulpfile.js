const { src, dest, series, parallel } = require('gulp');
const through2 = require('through2');
const del = require('delete');
const gulpIf = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const stripCssComments = require('gulp-strip-css-comments');
const gulpMergeJson = require('gulp-merge-json');

const srcRootDir = './src/';
const destRootDir = './dest'

const configDevp = require(srcRootDir + 'config.js')
const configProd = require(srcRootDir + 'config.prod.js');

const isArr = function (arr) {
  return Array.isArray(arr);
};

const isObj = function (obj) {
  return obj && !isArr(obj) && typeof obj === 'object';
};

// 合并配置对象
const mergeOptions = function(options1, options2, isCheck = true) {
  if (isCheck && (!isObj(options1) || !isObj(options2))) {
    throw new Error('mergeOptions params must be object')
  }

  for (let prop in options2) {
    const val1 = options1[prop];
    if (isObj(val1)) {
      mergeOptions(options1[prop], options2[prop], false);
    } else {
      options1[prop] = options2[prop];
    }
  }
  return options1;
};

// 配置文件
const generateConfigFile = function(cb) {
  const config = mergeOptions(configDevp, configProd);
  src(`${srcRootDir}config.js`)
    .pipe(through2.obj(function(file, _, cb) {
      let jsonStr = JSON.stringify(config, null, '  ');
      // 清除生成的对象属性名上的双引号
      jsonStr = jsonStr.replace(/"([^,]*?)":/g, '$1:');

      file.contents = Buffer.from('module.exports = ' + jsonStr)
      cb(null, file);
    }))
    .pipe(dest('dest/'));
  cb();
};

// 小程序应用配置文件
const appJsons = [`${srcRootDir}app.json`, `${srcRootDir}app.prod.json`];
const generateAppJSONFile = function(cb) {
  src(appJsons)
    .pipe(gulpMergeJson({
      fileName: 'app.json',
    }))
    .pipe(dest(destRootDir));
  cb();
};

// 小程序项目配置文件
const projectConfigJsons = [`${srcRootDir}project.config.json`, `${srcRootDir}project.config.prod.json`];
const generateProjectJSONFile = function(cb) {
  src(projectConfigJsons)
    .pipe(gulpMergeJson({
      fileName: 'project.config.json',
    }))
    .pipe(dest(destRootDir));
  cb();
};

const clean = function(cb) {
  del(destRootDir);
  cb();
};

// 正式环境下合并的文件
const ignoreFiles = [
  ...appJsons,
  ...projectConfigJsons,
  `${srcRootDir}config.js`,
  `${srcRootDir}config.prod.js`,
];

// 复制的文件
const copyNoramlFiles = [`${srcRootDir}**/*.*`];
ignoreFiles.forEach((item) => {
  copyNoramlFiles.push('!' + item);
});

const isWxmlFile = function(file) {
  return file.extname === '.wxml';
};

const isWxssFile = function(file) {
  return file.extname === '.wxss';
};

const generateNormalFiles = function(cb) {
  src(copyNoramlFiles)
    .pipe(gulpIf(isWxmlFile, htmlmin({ collapseWhitespace: true })))
    .pipe(gulpIf(isWxssFile, stripCssComments()))
    .pipe(dest(destRootDir));
  cb();
};

exports.clean = clean;
exports.prod = series(
  clean, 
  parallel(
    generateConfigFile,
    generateAppJSONFile, 
    generateProjectJSONFile,
    generateNormalFiles
  )
);