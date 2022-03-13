const RenderWrapper = (selector, renderFn) => {
    const observer = new MutationObserver(() => {
        const domList = document.querySelectorAll(selector)
        if (domList.length !== 0) {
            observer.disconnect()
            renderFn(domList)
        }
    })
    observer.observe(
        document.getElementsByTagName('body')[0],
        { childList: true, subtree: true }
    )
}
