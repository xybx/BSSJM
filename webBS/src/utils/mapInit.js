/* cesium */
import * as Cesium from 'cesium'
import h337 from 'heatmap.js'
import { mapTool } from './mapTool'
import AlertMarker from './cesiumEXT/alertMarker.js'
//import { specialEffects } from './cesiumEXT/specialEffectTool.js'
import BillboardGif from './cesiumEXT/BillboardGif'
let iconUrl = require('@/assets/layerTypeIcons/default.png')
// import { Viewer } from "cesium"; //引入cesium

export const mapInit = {
  viewer: null,
  handler: null,
  attrHandler:null,
  isMeasureHandler:false,
  points: [],
  typelist: [],
  curGlPointId: 0,
  //底图view初始化
  init(container = 'map') {
    Cesium.Ion.defaultAccessToken = window.cesiumToken

    this.viewer = new Cesium.Viewer('map', {
      animation: false, //是否显示动画控件
      homeButton: false, //是否显示home键
      geocoder: false, //是否显示查找控件
      baseLayerPicker: false, //是否显示图层选择控件
      timeline: false, //是否显示时间线控件
      fullscreenButton: false, //是否全屏显示
      scene3DOnly: false, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      infoBox: false, //是否显示点击要素之后显示的信息
      sceneModePicker: false, //是否显示投影方式控件  三维/二维
      navigationInstructionsInitiallyVisible: false,
      navigationHelpButton: false, //是否显示帮助信息控件
      selectionIndicator: false, //是否显示指示器组件
      shouldAnimate: true,
      contextOptions: {
        webgl: {
          alpha: true,
          depth: true,
          stencil: true,
          antialias: true,
          premultipliedAlpha: true,
          //通过canvas.toDataURL()实现截图需要将该项设置为true
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: true,
        },
      },
    })
    window.viewer = this.viewer

    //地下模式
    window.viewer.scene.screenSpaceCameraController.enableCollisionDetection = true
    window.viewer.scene.globe.depthTestAgainstTerrain = true //默认为false
    window.viewer.imageryLayers.removeAll()
    // 隐藏logo信息
    window.viewer._cesiumWidget._creditContainer.style.display = 'none'

    // 开启抗锯齿
    window.viewer.scene.postProcessStages.fxaa.enabled = true

    // 是否支持图像渲染像素化处理
    var supportsImageRenderingPixelated =
      window.viewer.cesiumWidget._supportsImageRenderingPixelated

    if (supportsImageRenderingPixelated) {
      window.viewer.resolutionScale = window.devicePixelRatio
    }

    if (!window.viewer.scene.pickPositionSupported) {
      window.alert('This browser does not support pickPosition.')
    }

    // 最小缩放高度（米）
    //window.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1000
    // //叠加底图
    this.addBaseLayer()
    // //叠加地形
    this.addTerrain()
    // //定位中心点
    this.locationCenter()
    // //叠加白膜
    this.addBaiMo()
  },
  //定位中心点
  locationCenter() {
    // 地图中心点
    window.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        mapCenter[0],
        mapCenter[1],
        Number(defaultScale)
      ),
    })
  },
  //定位图形中心点
  lookAt(center) {
    //let range = this.viewer.camera.positionCartographic.height;
    let viewHeight = window.viewer.camera.positionCartographic.height
    console.log(viewHeight, 'viewHeight')
    let range = viewHeight > 10000 ? 10000 : viewHeight
    //锁定视图中心点
    window.viewer.camera.lookAt(
      center,
      new Cesium.HeadingPitchRange(
        window.viewer.camera.heading,
        window.viewer.camera.pitch,
        range
      )
    )
    //取消锁定中心点
    window.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
  },
  //叠加底图
  addBaseLayer() {
    //console.log(window.baseLayerDatas,"window.baseLayerDatas");
    //影像图
    let baselayer = window.baseLayerDatas.filter(
      (p) => p.isTerrain == 0 && p.visible == true
    )[0]
    this.initLayerByKind(baselayer, true)
  },
  //叠加白膜
  addBaiMo() {
    this.initLayerByKind(baimoLayer, true)
  },

  //叠加地形
  async addTerrain() {
    let terrainlayer = window.baseLayerDatas.filter(
      (p) => p.isTerrain == 1 && p.visible == true
    )[0]
    let terrainProvider = new Cesium.CesiumTerrainProvider({
      url: terrainlayer.url,
      requestVertexNormals: true,
    })
    // if (isCesiumAdvancedVersion) {
    //   terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(
    //     terrainlayer.url
    //   )
    // }

    window.viewer.terrainProvider = terrainProvider
    //this.initLayerByKind(baimoLayer, true)
  },
  /*
    图层加载
    @isShow 显隐
    @kind 类型
        10 -> 天地图
        12 -> ArcGIS动态服务
        16 -> 倾斜摄影
*/
  async initLayerByKind(data, isShow) {
    let layer = null
    switch (data.kind) {
      case 10:
        layer = new Cesium.ImageryLayer(
          new Cesium.WebMapTileServiceImageryProvider({
            url: data.url + tiandituToken,
            layer: data.label,
            style: 'default',
            format: 'tiles',
            tileMatrixSetID: 'c',
            subdomains: data.subdomains,
            tilingScheme: new Cesium.GeographicTilingScheme(),
            tileMatrixLabels: data.tileMatrixLabels,
            minimumLevel: 0, //最小层级
            maximumLevel: 18, //最大层级
          }),
          {
            show: isShow,
          }
        )
        //console.log(layer)
        window.viewer.imageryLayers.add(layer)

        let zhujiLayerUrl = data.url.replaceAll('vec', 'cva')
        //加载注记层 【basemapType=1，电子地图】【basemapType=2，影像图】
        if (data.basemapType == 2) {
          zhujiLayerUrl = data.url.replaceAll('img', 'cia')
        }
        let zhujiLayer = new Cesium.ImageryLayer(
          new Cesium.WebMapTileServiceImageryProvider({
            //影像注记
            url: zhujiLayerUrl + tiandituToken,
            layer: 'tdtCiaLayer',
            style: 'default',
            format: 'tiles',
            tileMatrixSetID: 'c',
            subdomains: data.subdomains,
            tilingScheme: new Cesium.GeographicTilingScheme(),
            tileMatrixLabels: data.tileMatrixLabels,
            minimumLevel: 0, //最小层级
            maximumLevel: 18, //最大层级
          }),
          {
            show: isShow,
          }
        )
        window.viewer.imageryLayers.add(zhujiLayer)

        break
      case 12:
        layer = new Cesium.ImageryLayer(
          await Cesium.ArcGisMapServerImageryProvider.fromUrl(data.url),
          {
            show: isShow,
          }
        )
        layer.customAttr = data
        window.viewer.imageryLayers.add(layer)
        break
      case 16:
        layer = new Cesium.Cesium3DTileset({
          url: data.url,
          show: isShow,
        })
        layer.readyPromise.then(function () {
          //console.log(layer,data.url,isShow,"Cesium3DTileset")
          window.viewer.scene.primitives.add(layer)
        })
        // if (isCesiumAdvancedVersion) {
        //   layer = await Cesium.Cesium3DTileset.fromUrl(data.url)
        //   layer.customAttr = data
        // }
        // window.viewer.scene.primitives.add(layer)
        break
      default:
        break
    }
    return layer
  },
  //获取图标地址
  getMatterTypeIconUrl(typeObj) {
    let iconUrl = require('@/assets/layerTypeIcons/default.png')
    if (typeObj.icon) {
      //iconUrl = domainUrl + '/mattericon/'+typeObj.icon+'.png'
      iconUrl = 'mattericon/' + typeObj.icon + '.png'
    }
    return iconUrl
  },
  //渲染事件点数据到地图上
  async addLayerTreePoints(typeObj, name = 'dataPoint') {
    let iconUrl = this.getMatterTypeIconUrl(typeObj)
    //let iconUrl=iconUrl=typeObj.icon;
    typeObj.matters.forEach((m) => {
      if (m.longitude && m.latitude) {
        let lnglats = [m.longitude, m.latitude, 0]
        let postion = mapTool.coordinatesToCartesian3(lnglats)
        this.addBillBoard(iconUrl, postion, m, name)
      }
    })
  },
  //添加gif高亮点
  addPoingGif(pintData, imageurl = iconUrl, name = 'dataPoint') {
    debugger
    let lnglats = [pintData.longitude, pintData.latitude, 0]
    let postion = mapTool.coordinatesToCartesian3(lnglats)
    let bGif = new BillboardGif(
      this.viewer,
      postion,
      require('@/assets/layerTypeIcons/123.gif'),
      pintData,
      name
    )
    return bGif.billboardEntity
  },
  //扩散光圈
  // addPointEffect(pintData, imageurl = iconUrl, name = 'dataPoint') {
  //   debugger
  //   specialEffects()
  //   let lnglats = [pintData.longitude, pintData.latitude, 0]
  //   let postion = mapTool.coordinatesToCartesian3(lnglats)
  //   let _symbol = {
  //     // 图像地址，URI或Canvas的属性
  //     image: imageurl,
  //     // 设置颜色和透明度
  //     //color: Cesium.Color.fromCssColorString(this.symbol.color), //Cesium.Color.WHITE.withAlpha(0.8)
  //     //scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.6), //设置随图缩放距离和比例
  //     // 高度（以像素为单位）
  //     height: 32,
  //     // 宽度（以像素为单位）
  //     width: 32,
  //     // 逆时针旋转
  //     rotation: 0,
  //     // 大小是否以米为单位
  //     sizeInMeters: false,
  //     // 相对于坐标的垂直位置
  //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  //     // 相对于坐标的水平位置
  //     horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
  //     // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
  //     // pixelOffset: new Cesium.Cartesian2(10, 0),
  //     //让模型在地形上紧贴
  //     //heightReference: 1,
  //     //disableDepthTestDistance: 10,
  //     scale: 1.0,
  //     // 是否显示
  //     show: true,
  //     //disableDepthTestDistance:999999999,
  //     disableDepthTestDistance: 999999999,
  //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  //     //scaleByDistance: new Cesium.NearFarScalar(1200, 1, 5200, 0.4),
  //     //disableDepthTestDistance: 99000000,
  //     // scaleByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
  //     //translucencyByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
  //     //distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4.8e10),
  //     //clampToGround: true,
  //   }
  //   return viewer.entities.add({
  //     id: pintData.pid,
  //     name: name,
  //     position: postion,
  //     billboard: _symbol,
  //     properties: pintData,
  //     ellipse: {
  //       //height: 10, // 线圈的高度
  //       zIndex: 999999,
  //       outlineWidth: 10,
  //       semiMinorAxis: 100, // 线圈的横向长度
  //       semiMajorAxis: 100, // 线圈的竖向长度
  //       // material: new Cesium.CircleWaveMaterialProperty(Cesium.Color.fromCssColorString('rgba(1, 213, 222, 0.6)'), 2e3, 3, 0),
  //       disableDepthTestDistance: 0,
  //       //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  //       classificationType: Cesium.ClassificationType.BOTH,
  //       //extrudedHeightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
  //       //extrudedHeight :100,
  //       material: new Cesium.CircleWaveMaterialProperty(
  //         Cesium.Color.fromCssColorString('rgba(1, 213, 222, 1)'),
  //         2e3,
  //         5,
  //         0
  //       ), // 第一个参数是线圈的颜色，第二个参数是线圈的个数
  //       distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
  //         0.0,
  //         99999999.0
  //       ), // 在限定高度范围内才显示线圈
  //     },
  //   })
  // },
  //闪烁高亮点
  addSingleAlertMarker(pintData, imageurl = iconUrl, name = 'dataPoint') {
    let lnglats = [pintData.longitude, pintData.latitude, 0]
    let postion = mapTool.coordinatesToCartesian3(lnglats)
    let m1 = new AlertMarker({
      viewer: this.viewer,
      position: postion,
      //iconUrl: "../../static/images/pos_red.png",
      iconUrl: imageurl,
      color: Cesium.Color.RED,
      id: pintData.pid,
      name: name,
    })
    //this.addSinglePoint(pintData, imageurl)
    return m1.markerEntity
  },
  addSinglePoint(
    pintData,
    imageurl = iconUrl,
    name = 'dataPoint',
    geosize = 32
  ) {
    //let iconUrl=iconUrl=typeObj.icon;
    let lnglats = [pintData.longitude, pintData.latitude, 0]
    let postion = mapTool.coordinatesToCartesian3(lnglats)
    return this.addBillBoard(imageurl, postion, pintData, name, geosize)
  },
  //绘制广告牌
  addBillBoard(imageurl, postion, data, name, geosize) {
    let _symbol = {
      // 图像地址，URI或Canvas的属性
      image: imageurl,
      // 设置颜色和透明度
      //color: Cesium.Color.fromCssColorString(this.symbol.color), //Cesium.Color.WHITE.withAlpha(0.8)
      //scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.6), //设置随图缩放距离和比例
      // 高度（以像素为单位）
      height: geosize,
      // 宽度（以像素为单位）
      width: geosize,
      // 逆时针旋转
      rotation: 0,
      // 大小是否以米为单位
      sizeInMeters: false,
      // 相对于坐标的垂直位置
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      // 相对于坐标的水平位置
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
      // pixelOffset: new Cesium.Cartesian2(10, 0),
      //让模型在地形上紧贴
      //heightReference: 1,
      //disableDepthTestDistance: 10,
      scale: 1.0,
      // 是否显示
      show: true,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      //   100,
      //   250000.0
      // ),
      //scaleByDistance: new Cesium.NearFarScalar(1200, 1, 5200, 0.4),
      //disableDepthTestDistance: 99000000,
      // scaleByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
      //translucencyByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
      //distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4.8e10),
      //clampToGround: true,
    }
    let entity = window.viewer.entities.add(
      new Cesium.Entity({
        id: data.pid,
        name: name,
        position: postion,
        billboard: _symbol,
        properties: data,
      })
    )

    return entity
  },
  //根据类型权重生成热力图
  async createHeatMapByType(pointlist) {
    // var width = 1000
    // var height = 1000
    // 设置随机数据点数量

    let len = pointlist.length
    // 构建随机数据点
    let points = []
    // 设置最大值
    let max = 0
    // 设置热力图宽度和高度
    let width = 500 //window.viewer.canvas.width
    let height = 330 //window.viewer.canvas.height

    //计算四至坐标的屏幕坐标

    // 设置纬度最低点和最高点
    let latMin = extent.ymin
    let latMax = extent.ymax
    // 设置经度最低点和最高点
    let lonMin = extent.xmin
    let lonMax = extent.xmax

    let scaleX = ((lonMax - lonMin) * 3600) / width
    let scaleY = ((latMax - latMin) * 3600) / height

    console.log(scaleX, scaleY)

    while (len--) {
      if (
        pointlist[len].longitude > lonMin &&
        pointlist[len].longitude < lonMax &&
        pointlist[len].latitude > latMin &&
        pointlist[len].latitude < latMax
      ) {
        max = Math.max(max, pointlist[len].typevalue)
        let lon = ((pointlist[len].longitude - lonMin) * 3600) / scaleX
        let lat = ((latMax - pointlist[len].latitude) * 3600) / scaleY
        var point = {
          x: Math.round(lon, 4),
          y: Math.round(lat, 4),
          value: pointlist[len].typevalue,
        }
        points.push(point)
      }
    }

    // 创建热力图
    //function createHeatMap(max, data) {
    // 创建元素
    var heatDoc = document.createElement('div')
    heatDoc.setAttribute(
      'style',
      'width:' + width + 'px;height:' + height + 'px;margin: 0px;display: none;'
    )
    document.body.appendChild(heatDoc)
    // 创建热力图对象
    var heatmap = h337.create({
      // backgroundColor: 'rgba(255,0,0,1)',
      container: heatDoc,
      radius: 5,
      maxOpacity: 0.6,
      minOpacity: 0.3,
      blur: 0.9,
      gradient: {
        0.9: 'red',
        0.7: 'orange',
        0.5: 'yellow',
        0.3: 'green',
        0.1: 'blue',
      },
      scaleRadius: true,
      useLocalExtrema: false,
    })

    // max = Math.round(points.length * 0.05)
    // console.log(max, 'max')
    // 添加数据
    heatmap.setData({
      max: max,
      data: points,
    })

    // var coordinate = [-109.0, 10.0, -80.0, 35.0]
    debugger
    var coordinate = [extent.xmin, extent.ymin, extent.xmax, extent.ymax]
    //  // 设置纬度最低点和最高点
    //  let latMin = extent.ymin
    //  let latMax = extent.ymax
    //  // 设置经度最低点和最高点
    //  let lonMin = extent.xmin
    //  let lonMax = extent.xmax
    let heatmapEntity = window.viewer.entities.add({
      //name: 'Rotating rectangle with rotating texture coordinate',
      name: 'heatmap',
      id: 'heatmap',
      show: true,
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(
          coordinate[0],
          coordinate[1],
          coordinate[2],
          coordinate[3]
        ),
        //fill:Cesium.Color.RED,
        material: heatmap._renderer.canvas, // 核心语句，填充热力图
      },
    })
    window.viewer.zoomTo(heatmapEntity)

    //return heatmap
    //}
  },

  //根据点密度生成热力图
  async createHeatMapDotdensity(pointlist) {
    // var width = 1000
    // var height = 1000
    // 设置随机数据点数量

    let len = pointlist.length
    // 构建随机数据点
    let points = []
    // 设置最大值
    let max = 0
    // 设置热力图宽度和高度
    let width = 500 //window.viewer.canvas.width
    let height = 330 //window.viewer.canvas.height

    //计算四至坐标的屏幕坐标

    // 设置纬度最低点和最高点
    let latMin = extent.ymin
    let latMax = extent.ymax
    // 设置经度最低点和最高点
    let lonMin = extent.xmin
    let lonMax = extent.xmax

    let scaleX = ((lonMax - lonMin) * 3600) / width
    let scaleY = ((latMax - latMin) * 3600) / height

    console.log(scaleX, scaleY)

    while (len--) {
      if (
        pointlist[len].longitude > lonMin &&
        pointlist[len].longitude < lonMax &&
        pointlist[len].latitude > latMin &&
        pointlist[len].latitude < latMax
      ) {
        let lon = ((pointlist[len].longitude - lonMin) * 3600) / scaleX
        let lat = ((latMax - pointlist[len].latitude) * 3600) / scaleY
        var point = {
          x: Math.round(lon, 4),
          y: Math.round(lat, 4),
          value: 1,
        }
        points.push(point)
      }
    }

    // 创建热力图
    //function createHeatMap(max, data) {
    // 创建元素
    var heatDoc = document.createElement('div')
    heatDoc.setAttribute(
      'style',
      'width:' + width + 'px;height:' + height + 'px;margin: 0px;display: none;'
    )
    document.body.appendChild(heatDoc)
    // 创建热力图对象
    var heatmap = h337.create({
      // backgroundColor: 'rgba(255,0,0,1)',
      container: heatDoc,
      radius: 5,
      maxOpacity: 0.6,
      minOpacity: 0.3,
      blur: 0.9,
      gradient: {
        0.9: 'red',
        0.7: 'orange',
        0.5: 'yellow',
        0.3: 'green',
        0.1: 'blue',
      },
      scaleRadius: true,
      useLocalExtrema: false,
    })

    max = Math.round(points.length * 0.05)
    console.log(max, 'max')
    // 添加数据
    heatmap.setData({
      max: max,
      data: points,
    })

    // var coordinate = [-109.0, 10.0, -80.0, 35.0]
    debugger
    var coordinate = [extent.xmin, extent.ymin, extent.xmax, extent.ymax]
    //  // 设置纬度最低点和最高点
    //  let latMin = extent.ymin
    //  let latMax = extent.ymax
    //  // 设置经度最低点和最高点
    //  let lonMin = extent.xmin
    //  let lonMax = extent.xmax
    let heatmapEntity = window.viewer.entities.add({
      //name: 'Rotating rectangle with rotating texture coordinate',
      name: 'heatmap',
      id: 'heatmap',
      show: true,
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(
          coordinate[0],
          coordinate[1],
          coordinate[2],
          coordinate[3]
        ),
        //fill:Cesium.Color.RED,
        material: heatmap._renderer.canvas, // 核心语句，填充热力图
      },
    })
    window.viewer.zoomTo(heatmapEntity)

    //return heatmap
    //}
  },

  //加载geojson数据
  async loadGeoJson(fileUrl = null, geojson = null, isShow = true) {
    // viewer.dataSources.add(
    //   Cesium.GeoJsonDataSource.load('../../public/data/XZQXZ_BS.json', {
    //     stroke: Cesium.Color.HOTPINK,
    //     fill: Cesium.Color.PINK,
    //     strokeWidth: 3,
    //     markerSymbol: '?',
    //   })
    // )
    let geojsonData = fileUrl ? fileUrl : geojson
    let dataSource = Cesium.GeoJsonDataSource.load(geojsonData)
    let layer = await window.viewer.dataSources.add(dataSource)
    layer.show = isShow
    let entities = layer.entities.values

    //修改entity样式
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i]
      // entity.getProperty("gid");
      if (entity.polygon) {
        //console.log(entity.properties.jzgd._value,"entity.properties.jzgd._value");
        // entity.polygon.show = true
        // entity.polygon.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND // 贴地
        // //entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN
        // //entity.polygon.extrudedHeight = elevationHeight + Number(entity.properties.jzgd._value);
        // entity.polygon.height = 0
        // entity.polygon.extrudedHeightReference =
        //   Cesium.HeightReference.RELATIVE_TO_GROUND //拉伸
        // entity.polygon.extrudedHeight = 0 // 拉伸高度
        // entity.polygon.material = Cesium.Color.YELLOW
        // // entity.polygon.outline = true
        // // entity.polygon.outlineColor = Cesium.Color.RED
        // //entity.polygon.outlineWidth =10
        // console.log(entity, 'entity')
        entity.polygon.fill = false

        var positions = entity.polygon.hierarchy._value.positions
        window.viewer.entities.add({
          name: 'boderLine',
          polyline: {
            positions: positions,
            width: 5,
            material: Cesium.Color.YELLOW.withAlpha(0.5),
            clampToGround: true,
            classificationType: Cesium.ClassificationType.TERRAIN,
          },
        })
      }

      if (entity.polyline) {
        // entity.polyline.show=true
        // entity.polyline.width=5
        // entity.polyline.clampToGround=true
        // entity.polyline.material=Color.YELLOW
        // : {
        //   positions: positions,
        //   width: 2,
        //   material: Color.BLACK.withAlpha(0.5),
        //   clampToGround: true
      }

      //entity.polygon.fill = false;
      // entity.polyline = {
      //     positions: entity.polygon.hierarchy._value.positions,
      //     width: 2,
      //     material: Cesium.Color.fromCssColorString(this.symbol.outlinecolor)
      // }
    }
    return layer
  },

  //清除
  clearGeo() {
    // let geoJsonEntities = window.viewer.entities.values.filter(
    //   (p) => p.name != 'boderLine'
    // )

    // let dataEntities = window.viewer.entities.values.filter(
    //   (p) => p.name != 'dataPoint'
    // )
    console.log(window.viewer.entities.values)
    for (let index = 0; index < window.viewer.entities.values.length; index++) {
      const e = window.viewer.entities.values[index]
      if (
        e.name != 'boderLine' &&
        e.name != 'dataPoint' &&
        e.name != 'heatmap' &&
        e.name != 'glPoint' &&
        e.name != 'highlight_point'
      ) {
        index--
        //const ent = clearEntities[i]
        //console.log(e)

        window.viewer.entities.remove(e)
      }
    }
    //还原高亮点图标
    let curGLPoint = window.viewer.entities.getById(this.curGlPointId)
    if (curGLPoint) {
      let pointdata = this.points.filter((p) => p.pid == this.curGlPointId)[0]
      let type = this.typelist.filter((p) => p.pid == pointdata.typeid)[0]
      let iconUrl = this.getMatterTypeIconUrl(type)
      curGLPoint._billboard._image._value = iconUrl
    }

    //清除高亮闪烁
    let hightLightPoint = window.viewer.entities.getById('highlight_point')
    if (hightLightPoint) {
      window.viewer.entities.remove(hightLightPoint)
    }
    // window.viewer.entities.values.forEach((e) => {
    //   if (
    //     // e.name != 'boderLine' &&
    //     // e.name != 'dataPoint' &&
    //     // e.name != 'heatmap'
    //   ) {
    //     //const ent = clearEntities[i]
    //     console.log(e);
    //     window.viewer.entities.remove(e)
    //   }
    // })

    //let clearEntities=[...geoJsonEntities,...dataEntities]
    // let clearEntities = [...geoJsonEntities, ...dataEntities]
    // for (let i = 0; i < clearEntities.length; i++) {
    //   const ent = clearEntities[i]
    //   window.viewer.entities.remove(ent)
    // }
  },
}
