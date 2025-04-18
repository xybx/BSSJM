import * as Cesium from 'cesium'
import { helpers, area } from '@turf/turf'
import drawArc from './mapArcHelper'

export const mapTool = {
  //获取所有点在地形上的最低点高度
  async getMinHeightToTerrain(positions, viewer) {
    let heights = await this.getHeights(positions, viewer)
    let minHeight = 1000000
    heights.forEach((h) => {
      if (minHeight > h) {
        minHeight = h
      }
    })
    return minHeight
  },
  //获取所有点在地形上的高度
  async getHeights(positions, viewer) {
    let fromCartesians = []
    positions.forEach((p) => {
      let ps = Cesium.Cartographic.fromCartesian(p)
      fromCartesians.push(ps)
    })
    let terrain = viewer.terrainProvider
    let heights = []
    const updatedPositions = await Cesium.sampleTerrainMostDetailed(
      terrain,
      fromCartesians
    )
    for (var i = 0; i < updatedPositions.length; ++i) {
      if (updatedPositions[i]) {
        heights.push(updatedPositions[i].height)
      }
    }
    return heights
  },
  //笛卡尔坐标转为经纬度（二维）
  cartesian3ToDegrees2(position) {
    let c = Cesium.Cartographic.fromCartesian(position)
    return [
      Cesium.Math.toDegrees(c.longitude),
      Cesium.Math.toDegrees(c.latitude),
    ]
  },

  //经纬度坐标转为笛卡尔（三维）
  coordinatesToCartesian3(coordinate) {
    let position = Cesium.Cartesian3.fromDegrees(
      coordinate[0],
      coordinate[1],
      coordinate[2]
    )
    return position
  },
  //笛卡尔坐标转经纬度坐标（3d）-单个点
  cartesian3ToCoordinates(position) {
    const c = Cesium.Cartographic.fromCartesian(position)
    return [
      Cesium.Math.toDegrees(c.longitude),
      Cesium.Math.toDegrees(c.latitude),
      c.height,
    ]
  },
  //笛卡尔坐标转经纬度坐标（3d）-多点
  cartesian3ToCoordinatesList(positions) {
    let lnglats = []
    positions.forEach((p) => {
      const c = Cesium.Cartographic.fromCartesian(p)
      lnglats.push([
        Cesium.Math.toDegrees(c.longitude),
        Cesium.Math.toDegrees(c.latitude),
        c.height,
      ])
    })
    return lnglats
  },
  //计算点到点之间的空间距离
  getLength(points) {
    var length = 0
    for (var i = 0; i < points.length - 1; i++) {
      var point1cartographic = Cesium.Cartographic.fromCartesian(points[i])
      var point2cartographic = Cesium.Cartographic.fromCartesian(points[i + 1])
      /**根据经纬度计算出距离**/
      var geodesic = new Cesium.EllipsoidGeodesic()
      geodesic.setEndPoints(point1cartographic, point2cartographic)
      var s = geodesic.surfaceDistance
      //返回两点之间的距离
      s = Math.sqrt(
        Math.pow(s, 2) +
          Math.pow(point2cartographic.height - point1cartographic.height, 2)
      )
      length = length + s
    }
    if (length > 1000) {
      length = `${(length / 1000).toFixed(2)} km`
    } else {
      length = `${length.toFixed(2)} m`
    }
    return length
  },
  //水平距离距离计算函数
  getSpaceDistance(positions) {
    var distance = 0
    for (var i = 0; i < positions.length - 1; i++) {
      let cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        positions[i]
      )
      let lon = Cesium.Math.toDegrees(cartographic1.longitude)
      let lat = Cesium.Math.toDegrees(cartographic1.latitude)
      let cartographic2 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        positions[i + 1]
      )
      let lon2 = Cesium.Math.toDegrees(cartographic2.longitude)
      let lat2 = Cesium.Math.toDegrees(cartographic2.latitude)
      var length = Cesium.Cartesian3.distance(
        Cesium.Cartesian3.fromDegrees(lon, lat),
        Cesium.Cartesian3.fromDegrees(lon2, lat2)
      )
      distance = distance + length
    }
    if (distance > 1000) {
      distance = `水平距离 ${(distance / 1000).toFixed(2)} km`
    } else {
      distance = `水平距离 ${distance.toFixed(2)} m`
    }
    return distance
  },
  // 计算两点距离
  getTwoPointsText(firstPoint, secondPoint) {
    // 计算距离
    var length = Cesium.Cartesian3.distance(firstPoint, secondPoint)
    if (length > 1000) {
      length = (length / 1000).toFixed(2) + ' 千米'
    } else {
      length = length.toFixed(2) + ' 米'
    }
    return length
  },
  //计算多边形面积
  calcArea(postions) {
    let rings = []
    postions.map((vertex) => {
      //笛卡尔转弧度
      let carto_pt = Cesium.Cartographic.fromCartesian(vertex)

      //弧度转经纬度
      rings.push([
        Cesium.Math.toDegrees(carto_pt.longitude),
        Cesium.Math.toDegrees(carto_pt.latitude),
      ])
    })
    rings.push(rings[0])
    //转成feature Polygon
    let polygon_json = helpers.polygon([rings])
    //计算面积
    let surface = area(polygon_json)
    surface = parseFloat(surface.toFixed(0))
    let surfaceMu = (surface * 0.0015).toFixed(2) + '亩'
    // return surface;
    return { surface, surfaceMu }
  },
  // 计算两点角度
  calcAngel(firstPoint, secondPoint) {
    // 计算角度
    var angel = Cesium.Cartesian3.angleBetween(firstPoint, secondPoint)
    angel = (angel / Cesium.Math.RADIANS_PER_DEGREE).toFixed(2)
    return angel
  },
  // 画弧线
  //huxianEntity:弧线实体集合
  getHarcPoints(center, startPoint, endPoint, index, huxianEntity) {
    const viewer = window.viewer
    var start = Cesium.Cartographic.fromCartesian(startPoint)
    startPoint.longitude = Cesium.Math.toDegrees(start.longitude)
    startPoint.latitude = Cesium.Math.toDegrees(start.latitude)
    startPoint.height = start.height
    var center11 = Cesium.Cartographic.fromCartesian(center)
    center.longitude = Cesium.Math.toDegrees(center11.longitude)
    center.latitude = Cesium.Math.toDegrees(center11.latitude)
    center.height = center11.height
    var end = Cesium.Cartographic.fromCartesian(endPoint)
    endPoint.longitude = Cesium.Math.toDegrees(end.longitude)
    endPoint.latitude = Cesium.Math.toDegrees(end.latitude)
    endPoint.height = end.height

    let points = drawArc(
      [center.longitude, center.latitude, center.height],
      [startPoint.longitude, startPoint.latitude, startPoint.height],
      [endPoint.longitude, endPoint.latitude, endPoint.height],
      index
    )

    huxianEntity.push([
      viewer.entities.add(
        new Cesium.Entity({
          polyline: {
            positions: points,
            // positions:   new Cesium.CallbackProperty(() => points, false),
            width: 2,
            material: Cesium.Color.RED,
          },
        })
      ),
      points,
    ])

    return points
  },
  //量算功能用到的创建点元素
  addPoint(centerPoint) {
    return window.viewer.entities.add({
      // fromDegrees（经度，纬度，高度，椭球，结果）从以度为单位的经度和纬度值返回Cartesian3位置
      position: centerPoint,
      point: {
        // 点的大小（像素）
        pixelSize: 5,
        // 点位颜色，fromCssColorString 可以直接使用CSS颜色
        color: Cesium.Color.fromCssColorString('#ee0000'),
        // 边框颜色
        outlineColor: Cesium.Color.fromCssColorString('#fff'),
        // 边框宽度(像素)
        outlineWidth: 4,
        // 显示在距相机的距离处的属性，多少区间内是可以显示的
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,

        // 是否显示
        show: true,
      },
    })
  },
  // 添加文字标注
  //heightReference:（0:绝对高度，1：贴地形）
  addLabel(point, text, heightReference = 0) {
    const viewer = window.viewer
    return viewer.entities.add(
      new Cesium.Entity({
        position: point,
        label: {
          text: text,
          font: '14px sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE, //FILL  FILL_AND_OUTLINE OUTLINE
          fillColor: Cesium.Color.YELLOW,
          showBackground: true, //指定标签后面背景的可见性
          backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.8), // 背景颜色
          backgroundPadding: new Cesium.Cartesian2(6, 6), //指定以像素为单位的水平和垂直背景填充
          pixelOffset: new Cesium.Cartesian2(0, -25),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          heightReference: heightReference,
        },
      })
    )
  },
  /**
   * 鼠标移动提示信息
   * @point：坐标点
   * @text：提示信息
   */
  addTips(point, text) {
    let tips = window.viewer.entities.getById('tipEntity')
    if (tips) {
      window.viewer.entities.remove(tips)
    }
    tips = window.viewer.entities.add(
      new Cesium.Entity({
        position: point,
        id: 'tipEntity',
        label: {
          text: text,
          font: '12px sans-serif',
          style: Cesium.LabelStyle.FILL,
          fillColor: Cesium.Color.WHITE,
          showBackground: true, //指定标签后面背景的可见性
          backgroundColor: new Cesium.Color(0, 0, 0, 0.8), // 背景颜色
          backgroundPadding: new Cesium.Cartesian2(10, 10), //指定以像素为单位的水平和垂直背景填充
          pixelOffset: new Cesium.Cartesian2(50, 50),
          outlineWidth: 2,
          outlineColor: Cesium.Color.WHITE,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      })
    )
    return tips
  },
  // 画线-不贴地
  addLine(positions, clampToGround = false) {
    window.viewer.entities.add(
      new Cesium.Entity({
        polyline: {
          positions: new Cesium.CallbackProperty(() => positions, false),
          width: 2,
          material: Cesium.Color.YELLOW,
          clampToGround: clampToGround,
        },
      })
    )
  },
}

//js类函数定义
// export default  class maptool {
//   map = null
//   getmap() {}
// }
//js类引用
// let maptool = new maptool();
// let map = maptool.map;
