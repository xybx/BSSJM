import * as Cesium from 'cesium'
// 工具栏列表
export const toolList = [
  {
    label: '全图',
    code: 'qt',
    icon: 'icon-quantu',
    isFocus: false,
  },
  {
    label: '量算',
    code: 'ls',
    icon: 'icon-chizi1',
    isFocus: false,
  },
  {
    label: '底图',
    code: 'dt',
    icon: 'icon-ditu',
    isFocus: false,
  },
  {
    label: '清除',
    code: 'qc',
    icon: 'icon-icon_qingchu',
    isFocus: false,
  },
]
// 量算列表
export const measureList = [
  {
    pid: 1,
    label: '水平距离',
    icon: 'icon-shuipingjuli',
    code: 'spjl',
    isFocus: false,
  },
  {
    pid: 2,
    label: '垂直距离',
    icon: 'icon-chuizhijuli',
    code: 'czjl',
    isFocus: false,
  },
  {
    pid: 3,
    label: '空间距离',
    icon: 'icon-kongjian',
    code: 'kjjl',
    isFocus: false,
  },
  {
    pid: 4,
    label: '面积量算',
    icon: 'icon-area',
    code: 'mjls',
    isFocus: false,
  },
  {
    pid: 5,
    label: '三角测量',
    icon: 'icon-sanjiaoxing',
    code: 'sjcl',
    isFocus: false,
  },
  {
    pid: 6,
    label: '夹角测量',
    icon: 'icon-jiaodu',
    code: 'jjcl',
    isFocus: false,
  },
]

//   水平距离
//水平距离距离计算函数
export const getSpaceDistance = (positions) => {
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
}

// 垂直
export function verticalLine(positions, flag) {
  const viewer = window.viewer
  viewer.entities.add(
    new Cesium.Entity({
      polyline: {
        positions:
          flag == 0
            ? [positions[0], positions[1]]
            : [positions[1], positions[2]],
        width: 2,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.AQUA,
        }),
      },
    })
  )
  viewer.entities.add(
    new Cesium.Entity({
      polyline: {
        positions:
          flag == 0
            ? [positions[1], positions[2]]
            : [positions[0], positions[1]],
        material: Cesium.Color.YELLOW,
      },
    })
  )
}
export let verline1 = null
export let verline2 = null
//  flag: number
export function verticalLinemove(positions) {
  const viewer = window.viewer
  verline1 = viewer.entities.add(
    new Cesium.Entity({
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          if (flag == 0) {
            return [positions[0], positions[1]]
          } else {
            return [positions[1], positions[2]]
          }
          //  [positions[0], positions[1]];
        }, false),
        width: 2,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.AQUA,
        }),
      },
    })
  )

  verline2 = viewer.entities.add(
    new Cesium.Entity({
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          if (flag == 1) {
            return [positions[0], positions[1]]
          } else {
            return [positions[1], positions[2]]
          }
        }, false),
        width: 2,
        material: Cesium.Color.YELLOW,
      },
    })
  )
  //return [verline1, verline2]
}
// 算垂直距离
export const getLengthText = (points, flag) => {
  var cartographic = Cesium.Cartographic.fromCartesian(
    points[points.length - 1]
  )
  var height = Cesium.Cartographic.fromCartesian(
    points[points.length - 3]
  ).height

  var verticalPoint = Cesium.Cartesian3.fromDegrees(
    Cesium.Math.toDegrees(cartographic.longitude),
    Cesium.Math.toDegrees(cartographic.latitude),
    height
  )
  // 计算距离
  var length = Cesium.Cartesian3.distance(
    verticalPoint,
    points[points.length - 1]
  )
  if (length > 1000) {
    length = length / 1000
    length = flag == 1 ? length.toFixed(2) + ' km' : -length.toFixed(2) + ' km'
  } else {
    length = flag == 1 ? length.toFixed(2) + ' m' : -length.toFixed(2) + ' m'
  }
  return length
}
export let flag = 1 //判断高度值正还是负
export function verfuzhuPoint(movePosition, click, positions) {
  positions.pop()
  positions.pop()
  var height1 = Cesium.Cartographic.fromCartesian(
    positions[positions.length - 1]
  ).height
  var height2 = Cesium.Cartographic.fromCartesian(movePosition).height

  // 从高量低
  if (height1 > height2) {
    var cartographic = Cesium.Cartographic.fromCartesian(movePosition)
    var verticalPoint = Cesium.Cartesian3.fromDegrees(
      Cesium.Math.toDegrees(cartographic.longitude),
      Cesium.Math.toDegrees(cartographic.latitude),
      height1
    )
    flag = 0
  } else {
    var cartographic = Cesium.Cartographic.fromCartesian(
      positions[positions.length - 1]
    )
    var verticalPoint = Cesium.Cartesian3.fromDegrees(
      Cesium.Math.toDegrees(cartographic.longitude),
      Cesium.Math.toDegrees(cartographic.latitude),
      height2
    )
    flag = 1
  }

  positions.push(verticalPoint)
  positions.push(movePosition)

  if (click) {
    if (positions.length >= 3) verticalLine(positions, flag)
  }

  window.viewer.entities.remove(verline1)
  window.viewer.entities.remove(verline2)

   verticalLinemove(positions)
}
