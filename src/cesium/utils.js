export const mockClickChart = (event, chart) => {
    const evmousedown = document.createEvent('HTMLEvents')
    evmousedown.initEvent('mousedown', false, true)
    const evmouseup = document.createEvent('HTMLEvents')
    evmouseup.initEvent('mouseup', false, true)
    const evmouseclick = document.createEvent('HTMLEvents')
    evmouseclick.initEvent('click', false, true)

    for(const key in event) {
        try {
            evmouseclick[key] = event[key]
            evmousedown[key] = event[key]
            evmouseup[key] = event[key]
        } catch (err) { /* event 对象中部分属性是只读，忽略即可 */ }
    }

    // 事件触发的容器，即不是 #app 也不是 canvas，而是中间这个 div
    const container = chart._dom.firstElementChild
    
    container.dispatchEvent(evmousedown)
    container.dispatchEvent(evmouseup)
    container.dispatchEvent(evmouseclick)
}