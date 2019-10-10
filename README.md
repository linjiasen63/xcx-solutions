# xcx-solutions

> 微信小程序原生开发的解决文案（如promise化api接口、api请求错误处理等）

## 参考资料


## 引用项目

* [es6-promise垫片](https://github.com/stefanpenner/es6-promise)

## 版本管理（开发环境与生产环境）

* **实现原因：**

> 使用gulp自定义脚本处理 “开发环境”与“生产环境”中的配置差异（将开发代码重新打包一份，并修改相应配置）。具体做法：参考wepback的打包配置，“生产环境”下优先采用“生产环境”配置，其次采用“开发环境”配置，最终merge生成相应的配置文件。
>
> 如 app.json 在“开发环境”下直接使用该文件作为配置，而在“生产环境”下需要将app.json与app.prod.json进行merge得到新的app.json文件。此操作通过hook相应的动作自动执行。
>
> 需要合并配置文件有：config.js、app.json、project.config.json

* **具体过程：**

> 待定




