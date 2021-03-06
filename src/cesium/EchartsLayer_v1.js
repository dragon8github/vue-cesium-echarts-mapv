import echarts from 'echarts'
import GLMapCoordSys from './RegisterCoordinateSystem'
import { mockClickChart } from './utils.js'

var EchartsLayer = function (map, options) {
    this._map = map
    this._overlay = this._createChartOverlay()
    if (options) {
        this._registerMap()
    }
    this._overlay.setOption(options || {})
}

EchartsLayer.prototype._registerMap = function () {
    if (!this._isRegistered) {
        echarts.registerCoordinateSystem('GLMap', GLMapCoordSys),
            echarts.registerAction({ type: 'GLMapRoam', event: 'GLMapRoam', update: 'updateLayout' }, function (t, e) {}),
            echarts.extendComponentModel({
                type: 'GLMap',
                getBMap() {
                    return this.__GLMap
                },
                defaultOption: { roam: !1 },
            }),
            echarts.extendComponentView({
                type: 'GLMap',
                init(t, e) {
                    this.api = e
                    echarts.glMap.postRender.addEventListener(this.moveHandler, this)
                },
                moveHandler(t, e) {
                    this.api.dispatchAction({ type: 'GLMapRoam' })
                },
                render(t, e, i) {},
                dispose(t) {
                    echarts.glMap.postRender.removeEventListener(this.moveHandler, this)
                },
            })

        this._isRegistered = true
    }
}

EchartsLayer.prototype._createChartOverlay = function () {
    var scene = this._map.scene
    scene.canvas.setAttribute('tabIndex', 0)
    const ele = document.createElement('div')
    ele.style.position = 'absolute'
    ele.style.top = '0px'
    ele.style.left = '0px'
    ele.style.width = scene.canvas.width + 'px'
    ele.style.height = scene.canvas.height + 'px'
    ele.style.pointerEvents = 'none'
    ele.setAttribute('id', 'echarts')
    ele.setAttribute('class', 'echartMap')
    this._map.container.appendChild(ele)
    this._echartsContainer = ele
    echarts.glMap = scene
    this._chart = echarts.init(ele)
    this.resize()

    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
    handler.setInputAction(click => mockClickChart(event, this._chart), Cesium.ScreenSpaceEventType.LEFT_CLICK)

    return this._chart
}

EchartsLayer.prototype.dispose = function () {
    this._echartsContainer && (this._map.container.removeChild(this._echartsContainer), (this._echartsContainer = null)), this._overlay && (this._overlay.dispose(), (this._overlay = null))
}

EchartsLayer.prototype.updateOverlay = function (t) {
    this._overlay && this._overlay.setOption(t)
}

EchartsLayer.prototype.getMap = function () {
    return this._map
}

EchartsLayer.prototype.getOverlay = function () {
    return this._overlay
}

EchartsLayer.prototype.show = function () {
    this._echartsContainer && (this._echartsContainer.style.visibility = 'visible')
}

EchartsLayer.prototype.hide = function () {
    this._echartsContainer && (this._echartsContainer.style.visibility = 'hidden')
}

EchartsLayer.prototype.remove = function () {
    this._chart.clear()
    if (this._echartsContainer.parentNode) this._echartsContainer.parentNode.removeChild(this._echartsContainer)
    this._map = undefined
}

EchartsLayer.prototype.resize = function () {
    const me = this
    window.onresize = function () {
        const scene = me._map.scene
        me._echartsContainer.style.width = scene.canvas.style.width
        me._echartsContainer.style.height = scene.canvas.style.height
        me._chart.resize()
    }
}

export default EchartsLayer
