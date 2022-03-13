;(function (RenderWrapper, markdownit) {
    const md = markdownit({
        html: true,
    })
    const Padding = {
        github: {
            urlPrefix: 'https://api.github.com/repos/',
            updateTime: 'updated_at',
            content: 'body'
        },
        gitlab: {
            urlPrefix: 'https://gitlab.com/api/v4/projects/',
            updateTime: 'updated_at',
            content: 'description'
        }
    }

    RenderWrapper('.plugin-display, #plugin-display', (domList) => {
        for (const $dom of Array.prototype.slice.call(domList)) {
            const type = $dom.dataset.type || 'gitlab'
            const projectId = $dom.dataset.projectid
            const issueId = $dom.dataset.issueid
            const showTime = $dom.dataset.showTime === ''
            const handler = $dom.dataset.handler

            const exec = (data, handler) => {
                if (!handler) return data
                return handler(data)
            }

            const padding = Padding[type]
            loadFile(
                padding.urlPrefix + projectId + '/issues/' + issueId,
                function (data) {
                    data = JSON.parse(data)
                    $dom.innerHTML = md.render(
                        exec(data[padding.content], handler && Function('data', handler))
                    ) + (
                        showTime
                        ? '<p>更新时间：'
                            + new Date(data[padding.updateTime]).toLocaleString()
                            + '</p>'
                        : ''
                    )
                    Array.prototype.slice.call($dom.getElementsByTagName('a')).forEach($a => $a.target="_blank")
                })
        }
    })

    function loadFile (path, fn, errfn) {
        var request = new XMLHttpRequest()
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
})(RenderWrapper, markdownit)
