<!--
time: 2021-11-14
title: 详细说明
-->

$<toc{}>

## config.js 说明

| 字段 | 说明 |
|----|----|
| docRoot | markdown 文件根目录，非必须，默认为本项目的 index.html 所在的目录 |
| homepage | 主页路由，非必须，默认是 index.md |
| defaultTitle | 页面默认标题，非必须 |
| notFoundText | 找不到页面时要显示的文字，非必须 |
| notFoundPage | 找不到页面时要显示的页面路由，非必须，在与 notFoundText 同时设置时，此项优先显示 |
| theme | 用于设置主题。先将主题下载到 themes 目录中，然后填写主题文件名，不包含`.css` |
| showFooterText | 是否显示页脚文字，默认为 true |
| footerText | 自定义的页脚文字，支持 HTML。非必须 |
| rootPath | index.html 根路径，必须 |

## 路由规则

定义 url 中 `?` 后面的部分为路由。

- 路由中无须含有 docRoot
- 当目标目录中含有同名文件和目录时，会优先解析为文件

举例：

config.js:

```js
var Config = {
    docRoot: 'docs/',
    homepage: '',
    defaultTitle: '',
    notFoundText: '',
    notFoundPage: '',
}
```

docs/ 目录结构：

```
docs/
    example.md
    example
        index.md
```

如果路由为 `example` ，则会显示 `docs/example.md` 中的内容；如果路由为 `example/index`，则会显示 `docs/example/index.md` 中的内容。

如果 docs/ 的目录结构变为：

```
docs/
    example
        index.md
```
则路由无论是 `example` 还是 `example/index` 都会显示 `docs/example/index.md` 中的内容。

## 支持语法

本项目 markdown 解释器使用 [markdown-it](https://github.com/markdown-it/markdown-it)，所以支持所有 markdown-it 原生支持的 markdown 语法。同时支持代码高亮显示。

除此之外，还默认支持以下几个 markdown-it 配套插件：

- [markdown-it-mark](https://github.com/markdown-it/markdown-it-mark)
- [markdown-it-container](https://github.com/markdown-it/markdown-it-container)
- [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor)
- [markdown-it-toc-done-right](https://github.com/nagaozen/markdown-it-toc-done-right)

**文章导航目录（文章大纲）**

```
$<toc{}>
```

**mark**

```
==marked==
```
==marked==

**container**

```
::: tips
your content
:::

::: warning
your content
:::
```
::: tips
your content
:::
::: warning
your content
:::

## Front matter

从文件第一行开始，写入：

```
<!--
title: <标题>
time: <时间>
tags: <标签；多个标签用空格分开>
abstract: <摘要>
-->
```

写在 front matter 中的内容会被渲染到文档页面上。

## 内置主题

可以在 url 最后添加`&theme=<主题名称>`来预览。

比如：[?docs/usage&theme=autumn](?docs/usage&theme=autumn)

可用的主题：
- [default](?docs/usage&theme=default)
- [spring](?docs/usage&theme=spring)
- [autumn](?docs/usage&theme=autumn)
- [winter](?docs/usage&theme=winter)
- [paper](?docs/usage&theme=paper)
- [green](?docs/usage&theme=green)
- [yellow](?docs/usage&theme=yellow)
