import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/styles/index.scss'

// 导入 cesiunm 资源包
import * as Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'

// 加入到全局，方便调试和使用
Vue.prototype.Cesium = window.Cesium = Cesium

// 导入 mapv
// 1、由于 mapv.cesiumMapLayer 依赖全局环境的 Cesium 变量，所以上面一步需要先装载到全局
// 2、不可以使用 import 导入 mapv，必须使用 require。原因是我必须等待上一句 cesium 装载到全局才可以。如果是 import 会自动提升到代码顶部执行。
const mapv = require('mapv')

// 加入到全局，方便调试和使用
Vue.prototype.mapv = window.mapv = mapv

// 打印资料，方便调试
window.getInfo = (_viewer) => {
    const viewer = _viewer || window.viewer
    // 获取经纬度信息
    const { longitude, latitude, height } = viewer.camera._positionCartographic
    // 获取当前视角的 Rectangle（东南西北）
    const currentViewRect = viewer.camera.computeViewRectangle()
    // 经纬度高度
    console.log(`${Cesium.Math.toDegrees(longitude)}, ${Cesium.Math.toDegrees(latitude)}, ${Math.ceil(height)}`, currentViewRect)
    // 相机位置
    console.log(`{ heading: ${viewer.camera.heading}, pitch: ${viewer.camera.pitch}, roll: ${viewer.camera.roll} }`)
}

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
