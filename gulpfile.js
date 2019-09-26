const { src, dest, series, parallel } = require('gulp');
const through2 = require('through2');
const del = require('delete');
const gulpIf = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const stripCssComments = require('gulp-strip-css-comments');
const gulpMergeJson = require('gulp-merge-json');

const configDevp = require('./src/config.js')
const configProd = require('./src/config.prod.js');
const fs = require('fs');

// 合并配置对象
const mergeOptions = function(options1, options2, isCheck = true) {
  if (isCheck && (typeof options1 != 'object' || typeof options2 != 'object')) {
    throw new Error('mergeOptions params must be object')
  }

  for (let prop in options2) {
    const val1 = options1[prop];
    if (val1 && typeof val1 === 'object') {
      mergeOptions(options1[prop], options2[prop], false);
    } else {
      options1[prop] = options2[prop];
    }
  }
  return options1;
};

const generateConfigFile = function(cb) {
  const config = mergeOptions(configDevp, configProd);
  src('./src/config.js')
    .pipe(through2.obj(function(file, _, cb) {
      file.contents = Buffer.from('module.exports = ' + JSON.stringify(config, null, '  '))
      cb(null, file);
    }))
    .pipe(dest('dest/'));
  cb();
};

const appJsons = ['./src/app.json', './src/app.prod.json'];
const generateAppJSONFile = function(cb) {
  src(appJsons)
    .pipe(gulpMergeJson({
      fileName: 'app.json',
    }))
    .pipe(dest('./dest'));
  cb();
};

const projectConfigJsons = ['./src/project.config.json', './src/project.config.prod.json'];
const generateProjectJSONFile = function(cb) {
  src(projectConfigJsons)
    .pipe(gulpMergeJson({
      fileName: 'project.config.json',
    }))
    .pipe(dest('./dest'));
  cb();
};

const clean = function(cb) {
  del('./dest');
  cb();
};

// 正式环境下合并的文件
const ignoreFiles = [
  ...appJsons,
  ...projectConfigJsons,
  './src/config.js',
  './src/config.prod.js',
];

// 复制的文件
const copyNoramlFiles = ['./src/**/*.*'];
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
    .pipe(dest('./dest/'));
  cb();
};

exports.clean = clean;
exports.prod = series(clean, parallel(generateConfigFile, generateNormalFiles, generateAppJSONFile, generateProjectJSONFile));