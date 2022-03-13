;(function (
    Config,
    markdownit,
    markdownitMark,
    markdownItAnchor,
    markdownitContainer,
    markdownItTocDoneRight,
    hljs
) {
    const $footerText = document.getElementById('footer-text')
    const $customedFooterText = document.getElementById('customed-footer-text')
    document.title = Config.defaultTitle || 'Quick Markdown'
    const notFoundMessage = Config.notFoundText || '404 not found'

    const hash = window.location.hash.substring(1)
    var query = window.location.search.substring(1).split('&')[0]
    if (!query || query === Config.homepage.split('.')[0]) {
        document.getElementById('footer-buttons').style.display = 'none'
    }
    if ($footerText && $customedFooterText) {
        if (Config.showFooterText) {
            $customedFooterText.innerHTML = Config.footerText
        } else {
            $footerText.style.display = 'none'
        }
    }

    function loadPage (mdRender, query, errfn, finishedCallback) {
        loadFile(resolveQuery(query, true), function (data) {
            renderPage(data, mdRender)
            typeof finishedCallback === 'function'
                ? finishedCallback() : 1
        }, function () {
            loadFile(resolveQuery(query, false), function (data) {
                renderPage(data, mdRender)
                typeof finishedCallback === 'function'
                    ? finishedCallback() : 1
            }, function () {
                typeof errfn === 'function' ? errfn() : ''
                typeof finishedCallback === 'function'
                    ? finishedCallback() : 1
            })
        })
    }
    function load404 (mdRender) {
        document.title = '404'
        if (Config.notFoundPage) {
            loadPage(mdRender, Config.notFoundPage, function () {
                document.getElementById('article').innerHTML = '<p style="text-align: center;">' + notFoundMessage + '</p>'
            })
        } else {
            document.getElementById('article').innerHTML = '<p style="text-align: center;">' + notFoundMessage + '</p>'
        }
    }
    function renderPage (data, mdRender) {
        document.getElementById('article').innerHTML = mdRender.render(renderFrontMatter(data))
        try {
            document.title = document.getElementsByClassName('doc-title')[0].textContent
        } catch (_) {}
    }
    function resolveQuery (query, isFileName) {
        if (query.substring(query.length - 3) === '.md') {
            return Config.docRoot + query
        }
        return query
        ? decodeURIComponent(Config.docRoot + query + (isFileName ? '.md' : '/index.md'))
        : resolveQuery(Config.homepage || 'index.md')
    }

    function loadFile (path, fn, errfn) {
        const request = new XMLHttpRequest()
        request.open('get', path)
        request.send(null)
        request.onload = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    fn(request.responseText)
                } else {
                    console.warn('Load file ' + path + ' failed.')
                    typeof errfn === 'function' ? errfn() : ''
                }
            }
        }
    }

    function renderFrontMatter (content) {
        const res = {}
        if (content.indexOf('<!--') === 0) {
            const raw = content.match(/^<!--(.*?)-->/s)[1]
            raw.split('\n')
                .forEach(e => {
                    if (e.replace(' ', '').length === 0) {
                        return
                    }
                    const d = e.split(':')
                    res[d[0].replace(' ', '')] = d.slice(1).join('').replace(/^ /, '') 
                })
        }
        res.tags = res.tags ? res.tags.split(' ') : []

        let renderedTitle = ''
        let renderedTime = ''
        let renderedTags = ''
        let renderedAbstract = ''

        if (res.title) {
            renderedTitle = '<h1 class="doc-title">' + res.title + '</h1>'
        }
        if (res.time) {
            renderedTime = '<div class="doc-time">' + res.time + '</div>'
        }
        if (res.tags.length) {
            for (var i = 0; i < res.tags.length; i++) {
                renderedTags += '<span class="doc-single-tag">' + res.tags[i] + '</span>'
            }
            renderedTags = '<div class="doc-tags">' + renderedTags + '</div>'
        }
        if (res.abstract) {
            renderedAbstract = '\n\n> ' + res.abstract + '\n\n'
        }
        const renderedInfo = renderedTime + renderedTags
        const rendered = 
            renderedTitle
            + (renderedInfo ? '<div class="doc-info">' : '')
                + renderedInfo
            + (renderedInfo ? '</div>' : '')
            + renderedAbstract
            + '\n\n'

        return rendered + content
    }


    const md = markdownit({
        html: true,
        highlight: function (str, lang) {
            if (lang && hljs && hljs.getLanguage(lang)) {
                try {
                    return '<pre class="hljs"><code>' +
                     hljs.highlight(str, { language: lang }).value
                     + '</code></pre>'
                } catch (_) {}
            }
            return '<pre class="hljs"><code>' +
                     md.utils.escapeHtml(str)
                     + '</code></pre>'
        }
    })
    md.use(markdownItAnchor, {
        level: 1,
        permalink: false,
        containerId:"header-toc"
    }).use(markdownItTocDoneRight, {
        level: [1, 2]
    })
    .use(markdownitMark)
    .use(markdownitContainer, 'tips')
    .use(markdownitContainer, 'warning')

    loadPage(md, query, function () {
        load404(md)
    }, function () {
        document.getElementsByTagName('body')[0].style.visibility = 'visible'
        if (hash) window.location.href = "#" + hash
    })
})(
    Config,
    markdownit,
    markdownitMark,
    markdownItAnchor,
    markdownitContainer,
    markdownItTocDoneRight,
    window.hljs
)
