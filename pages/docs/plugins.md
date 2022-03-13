<!--
time: 2021-11-14
title: 插件系统
-->

$<toc{}>

## 运行

执行命令：

```
node plugins/index.js
```

即可运行所有在 `plugins/config.json` 中设置的插件。

`plugins/config.json` 格式为 `[插件目录名, 插件参数列表]` 。同一个插件可运行多次。

如：

```
[
    ["files-list", [
        "-d", "docs/",
        "-o", "data/docs-list",
        "-e", ".md"
    ]],
    ["files-list", [
        "-d", "docs/",
        "-o", "data/docs-list-2",
        "-e", ".html"
    ]]
]
```

## 预置插件

### files-list - 文件列表

在 `index.html` 底部引入：

```
<script src="./plugins/files-list/ui.js"></script>
```

然后执行：

```
node plugins/files-list/index.js -d docs
```

最后在需要显示文件列表的地方插入代码：

```
<div data-show-time data-show-tags class="plugins-files-list" data-path="data/docs-list"></div>
```

效果如下：

<div data-show-time data-show-tags class="plugins-files-list" data-path="data/docs-list"></div>

html 标签属性可选参数：

| 属性名 | 值类型 | 可选值 | 注释 |
| --- | --- | --- | --- |
| data-path | String | - | 数据源路径 |
| data-show-time | - | - | 显示时间 |
| data-show-tags | - | - | 显示标签 |
| data-show-abstract | - | - | 显示摘要 |
| data-sort | String | 'time' | 根据什么进行排序 |
| data-asc | - | - | 按照升序排列 |
| data-tags | String | 已有的 tag 名称，多个 tag 用英文逗号分开 | 根据指定 tag 筛选显示的内容 |
| data-max | String | - | 显示的最大条数 |

除此之外，可以通过访问：

```
/<Config.rootPath>/plugins/files-list/?path=data/files-list.output&show-tags&show-time
```

来获得归档页面。

### display - issue 内容展示

用来展示 gitlab 或 github 指定 issue 的内容。是一种对于页面频繁更新情况的解决方案。

在 `plugins/display/config.js` 中写入配置：

```
var PluginDisplayConfig = {
    githubtest: {
        'type': 'github',
        'title': 'githubtest',
        'showUpdateTime': true,
        'projectId': 'mengrru/quick-markdown',
        'issueId': 1
    }
}
```

然后访问 `/<Config.rootPath>/plugins/display?githubtest` 即可看到页面。

参数说明：

| 属性名 | 值类型 | 可选值 | 注释 |
| --- | --- | --- | --- |
| type | String | 'github', 'gitlab' | issue 服务的提供者 |
| title | String | - | 页面标题 |
| projectId | String | - | 对于 github，填写 <用户id>/<仓库名称>；对于 gitlab，填写 project id |
| issueId | Number | - | issue id |
| showUpdateTime | Boolean | - | 是否显示最后更新时间 |
