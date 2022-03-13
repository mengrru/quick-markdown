;(function () {
    const State = {
        Waiting: 0,
        Rendering: 1,
        Rendered: 2
    }
    let state = State.Waiting
    const renderFilesListUI = function (domList) {
        state = State.Rendering
        for (const $dom of domList) {
            const sortBy = $dom.dataset.sort
            const isAsc = $dom.dataset.asc === '' // dec default
            const dataPath = $dom.dataset.path
            const showTags = $dom.dataset.showTags === ''
            const showTime = $dom.dataset.showTime === ''
            const showAbstract = $dom.dataset.showAbstract === ''
            const filterTags = $dom.dataset.tags && new Set($dom.dataset.tags.split(','))
            const max = $dom.dataset.max

            loadFile(dataPath, (dataStr) => {
                let data = JSON.parse(dataStr)
                if (sortBy === 'time') {
                    data.sort((a, b) => isAsc
                        ? (a.frontMatter.time > b.frontMatter.time ? 1 : -1)
                        : (a.frontMatter.time > b.frontMatter.time ? -1 : 1))
                }
                if (filterTags) {
                    data = data.filter(
                        item =>
                            item.frontMatter.tags.some(tag =>
                                filterTags.has(tag)
                            )
                    )
                }
                if (max) {
                    data = data.slice(0, max)
                }
                data.forEach(d => {
                    const $item = document.createElement('div')
                    const $time = document.createElement('div')
                    const $tags = document.createElement('div')
                    const $title = document.createElement('div')
                    const $abstract = document.createElement('div')

                    $item.className = 'file-item'
                    $time.className = 'file-time'
                    $tags.className = 'file-tags'
                    $title.className = 'file-title'
                    $abstract.className = 'file-abstract'

                    if (!showTime) $time.style.display = 'none'
                    if (!showTags) $tags.style.display = 'none'
                    if (!showAbstract) $abstract.style.display = 'none'

                    $time.innerText = d.frontMatter.time
                    $abstract.innerText = d.frontMatter.abstract || ''

                    const $titleLink = document.createElement('a')
                    $titleLink.innerText = d.frontMatter.title
                    $titleLink.href = window.location.href.replace(/plugins\/files-list.*|\?.*/, '') + `?${d.fileData.docPath}`
                    $title.appendChild($titleLink)

                    for (const t of d.frontMatter.tags) {
                        const $tag = document.createElement('span')
                        $tag.className = 'file-tag'
                        $tag.innerText = t
                        $tags.appendChild($tag)
                    }

                    $item.append($time, $tags, $title, $abstract)
                    $dom.appendChild($item)
                })
            }, () => {
                $dom.innerHTML = '加载失败'
            })
        }
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

    launch()

    document.addEventListener('DOMSubtreeModified', function () {
        launch()
    })

    function launch () {
        const domList = document.getElementsByClassName('plugins-files-list')
        if (domList.length !== 0 && state === State.Waiting) {
            document.removeEventListener('DOMSubtreeModified', launch)
            renderFilesListUI(domList)
        }
    }
})()
