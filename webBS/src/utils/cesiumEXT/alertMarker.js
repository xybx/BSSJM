// 闪烁点
export default class AlertMarker {
  constructor(options) {
    this.viewer = options.viewer
    this.position = options.position
    this.color = options.color || Cesium.Color.RED
    this.iconUrl = options.iconUrl
    this.pixelSize = options.pixelSize || 32
    this.pixelMax = options.pixelMax || 50
    this.outWidth = options.outWidth || 20
    this.id = options.id
    this.name = options.name
    this.createMarker()
  }

  createMarker() {
    var markerOpacity = 1,
      a = true,
      pixelSize = this.pixelSize,
      n = true,
      outLineOpacity = 0.7,
      o = true,
      t = 0,
      pixelMax = this.pixelMax
    this.markerEntity = this.viewer.entities.add({
      position: this.position,
      id: 'highlight_point',
      name: this.name,
    })

    this.markerEntity.point = {
      color: new Cesium.CallbackProperty(() => {
        return (
          a
            ? ((markerOpacity -= 0.03), markerOpacity <= 0 && (a = false))
            : ((markerOpacity = 1), (a = true)),
          this.color.withAlpha(markerOpacity)
        )
      }, false),
      pixelSize: new Cesium.CallbackProperty((time, result) => {
        return (
          n
            ? ((pixelSize += 2), pixelSize >= pixelMax && (n = false))
            : ((pixelSize = 10), (n = true)),
          pixelSize
        )
      }, false),
      outlineColor: new Cesium.CallbackProperty(() => {
        return (
          o
            ? ((outLineOpacity -= 0.035), outLineOpacity <= 0 && (o = false))
            : ((outLineOpacity = 0.7), (o = true)),
          this.color.withAlpha(outLineOpacity)
        )
      }, false),
      outlineWidth: this.outWidth,
      //disableDepthTestDistance: 99000000,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      //   scaleByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
      //   translucencyByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
      //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4.8e10),
      //scaleByDistance: new Cesium.NearFarScalar(1200, 1, 5200, 0.4),
    }

    // if (this.iconUrl) {
    //   debugger
    //   this.markerEntity.billboard = {
    //     height: 32,
    //     // 宽度（以像素为单位）
    //     width: 32,
    //     image: this.iconUrl,
    //     show: true,
    //     // 相对于坐标的垂直位置
    //     // verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    //     // // 相对于坐标的水平位置
    //     // horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    //     disableDepthTestDistance: Number.POSITIVE_INFINITY,
    //     //scaleByDistance: new Cesium.NearFarScalar(1200, 1, 5200, 0.4), //设置随图缩放距离和比例
    //     //distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000), //设置可见距离 10000米可见
    //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    //     //scaleByDistance: new Cesium.NearFarScalar(1200, 1, 5200, 0.4), //设置随图缩放距离和比例
    //     //distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
    //     scaleByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
    //     translucencyByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
    //     distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //       0,
    //       4.8e10
    //     ),
    //   }
    // }
  }

  remove() {
    this.viewer.entities.remove(this.markerEntity)
    this.markerEntity = undefined
  }
}
