import echarts from 'echarts'
import * as Cesium from 'cesium/Cesium'

// https://github.com/happyport/Cesium-Echarts4
// 必须暴露出 dimensions 和 create 的静态属性
class RegisterCoordinateSystem {
    static dimensions = ['lng', 'lat']

    constructor(glMap) {
        this._GLMap = glMap
        this._mapOffset = [0, 0]
        this.dimensions = ['lng', 'lat']
    }

    setMapOffset(mapOffset) {
        this._mapOffset = mapOffset
    }

    getBMap() {
        return this._GLMap
    }

    fixLat(lat) {
        return lat >= 90 ? 89.99999999999999 : lat <= -90 ? -89.99999999999999 : lat
    }

    dataToPoint(coords) {
        let lonlat = [99999, 99999]
        coords[1] = this.fixLat(coords[1])
        let position = Cesium.Cartesian3.fromDegrees(coords[0], coords[1])
        if (!position) return lonlat
        let coordinates = this._GLMap.cartesianToCanvasCoordinates(position)
        if (!coordinates) return lonlat
        if (this._GLMap.mode === Cesium.SceneMode.SCENE3D) {
            if (Cesium.Cartesian3.angleBetween(this._GLMap.camera.position, position) > Cesium.Math.toRadians(75)) return !1
        }
        return [coordinates.x - this._mapOffset[0], coordinates.y - this._mapOffset[1]]
    }

    pointToData(pt) {
        var mapOffset = this._mapOffset
        pt = this._bmap.project([pt[0] + mapOffset[0], pt[1] + mapOffset[1]])
        return [pt.lng, pt.lat]
    }

    getViewRect() {
        let api = this._api
        return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight())
    }

    getRoamTransform() {
        return echarts.matrix.create()
    }

    static create(echartModel, api) {
        this._api = api
        let registerCoordinateSystem
        echartModel.eachComponent('GLMap', function (seriesModel) {
            let painter = api.getZr().painter
            if (painter) {
                // let glMap = api.getViewportRoot()
                let glMap = echarts.glMap
                registerCoordinateSystem = new RegisterCoordinateSystem(glMap, api)
                registerCoordinateSystem.setMapOffset(seriesModel.__mapOffset || [0, 0])
                seriesModel.coordinateSystem = registerCoordinateSystem
            }
        })

        echartModel.eachSeries(function (series) {
            'GLMap' === series.get('coordinateSystem') && (series.coordinateSystem = registerCoordinateSystem)
        })
    }
}

export default RegisterCoordinateSystem
