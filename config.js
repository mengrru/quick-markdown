var Config = {
    docRoot: 'pages/',
    homepage: 'docs/index.md',
    notFoundText: '',
    defaultTitle: 'quick-markdown',
    notFoundPage: '',
    theme: 'default',
    showFooterText: true,
    footerText: '',
    rootPath: '/quick-markdown/'
}

if (typeof module === 'object') {
    module.exports = Config
} else if (window && document) {
    const themeInfo = 
        window.location.search
            .slice(1).split('&')
            .slice(1).map(e => e.split('='))
            .filter(e => e[0] === 'theme')[0]
    const themeName = themeInfo && themeInfo[1]
    const themeRootPath = Config.rootPath +
        (
          (themeName && 'themes/' + themeName)
        || (Config.theme && 'themes/' + Config.theme)
        )

    loadCSS(themeRootPath + '/index.css')

    fetch(themeRootPath + '/header.html')
      .then(res => res.text())
      .then(data =>
        document.getElementById('header').innerHTML = data
      )

    function loadCSS (url) {
        if (!url) {
            document.getElementsByTagName('html')[0].style.display = 'block'
            return
        }
        const head = document.getElementsByTagName('head')[0]
        const link = document.createElement('link')
        link.type = 'text/css'
        link.rel = 'stylesheet'
        link.href = url
        head.appendChild(link)
        document.getElementsByTagName('html')[0].style.display = 'block'
        return link
    } 
}
