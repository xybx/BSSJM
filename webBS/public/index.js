//本地
// const apiURL = 'http://192.168.1.155:9100'
// const apiURL = "http://192.168.1.136:8087";
//测试
// const apiURL = "http://47.104.12.127:8091";
//正式 https://27.195.3.192:9100
const apiURL = 'https://jwb.dpinfo.com.cn:9100/szxcapi'
//const domainUrl="http://192.168.1.177:9293/";
//牟平
// const apiURL = "http://202.102.167.60:9003";
//const midApiURL = 'http://172.20.46.73:9003'
//文档地址预览
const fileURL = 'http://192.168.1.155:8012'
//图片验证码精度 值的范围是1到10 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。
const accuracy = 8
const videoUrl = 'http://192.168.1.156:9093'
//农田位置服务地址
// const ntwzMapServerUrl="http://47.104.12.127:6080/arcgis/rest/services/XLZ/XLZ_NTWZ/MapServer/0";
// const ntwzFeatureServerUrl="http://47.104.12.127:6080/arcgis/rest/services/XLZ/XLZ_NTWZ/FeatureServer/0";
const ntwzMapServerUrl =
  'http://39.75.167.89:6080/arcgis/rest/services/XLZ/XLZ_NTWZ/MapServer/0'
const ntwzFeatureServerUrl =
  'http://39.75.167.89:6080/arcgis/rest/services/XLZ/XLZ_NTWZ/FeatureServer/0'
//家庭位置
// const familyMapAddressServerUrl="http://47.104.12.127:6080/arcgis/rest/services/XLZ/XLZ_NTWZ/MapServer/0";
// const familyFeatureAddressServerUrl="http://47.104.12.127:6080/arcgis/rest/services/XLZ/XLZ_NTWZ/FeatureServer/0";
const familyMapAddressServerUrl =
  'http://39.75.167.89:6080/arcgis/rest/services/XLZ/XLZ_NTWZ/MapServer/0'
const familyFeatureAddressServerUrl =
  'http://39.75.167.89:6080/arcgis/rest/services/XLZ/XLZ_NTWZ/FeatureServer/0'

const serverurl = ''
//透明地图地址 http://47.104.12.127:6080/arcgis/rest/services/BJZ/BJZ_DT/MapServer
const TMTServerUrl =
  'http://39.75.167.89:6080/arcgis/rest/services/BJZ/BJZ_DT/MapServer'
//行政区服务
const xzqserverurl =
  'http://202.102.167.60:6080/arcgis/rest/services/MPQ/MPQ_ZXFWX/MapServer/0'
//乡村旅游
const tourServerUrl =
  'http://39.75.167.89:6080/arcgis/rest/services/XCLY/XCLY/FeatureServer/0'

/* cesium 密钥 */
const cesiumToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MGMzM2NmOC0xN2M5LTQ0YzgtOWI1Ni1lYjhkY2RkZmIyZjgiLCJpZCI6MTA3OTU1LCJpYXQiOjE2NjMxMzkwMTZ9.Yz3FgXGRreHtJkEqn1nE8lx13nMj2JYW0SHgVDeH9jc'

// 服务类型
const mapTypes = [
  {
    pid: 1,
    label: 'ArcGisMapServerImagery/ArcGIS服务',
    kind: 12,
  },
  {
    pid: 2,
    label: 'CesiumTerrainProvider/Ceisum标准地形图',
    kind: 13,
  },
  {
    pid: 3,
    label: 'GeoJsonDataSource/Geojson服务',
    kind: 14,
  },
  {
    pid: 4,
    label: 'KmlDataSource/kml矢量数据',
    kind: 15,
  },
  {
    pid: 5,
    label: 'Cesium3DTileset/3DTileset',
    kind: 16,
  },
  {
    pid: 6,
    label: '天地图',
    kind: 10,
  },
]

//地图中心点(博山区人民政府)
const mapCenter = [117.862057, 36.494912]
//地图范围四至
const extent = {
  xmin: 117.71,
  ymin: 36.26,
  xmax: 118.21,
  ymax: 36.59,
}
//117.71,36.26;118.21,36.59
//地图默认比例尺
const defaultScale = 100000
const tiandituToken = 'a6798a0c841004f84487f874a146cba6'
//底图数组
const baseLayerDatas = [
  {
    label: '天地图影像',
    basemapType: 2,
    isTiandi: 1,
    url: 'https://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=',
    kind: 10,
    isTerrain: 0,
    pid: 1,
    visible: true,
    tileMatrixLabels: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
    ],
    subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    imgurl: 'baseLayerImgs/yxt.jpg',
  },
  {
    label: '天地图电子地图',
    basemapType: 1,
    isTiandi: 1,
    url: 'https://{s}.tianditu.gov.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=',
    kind: 10,
    isTerrain: 0,
    pid: 2,
    visible: false,
    tileMatrixLabels: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
    ],
    subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    imgurl: 'baseLayerImgs/dzdt.jpg',
  },
  {
    label: '高程模型',
    pid: 999,
    //url: 'http://192.168.1.250:9003/terrain/8xbeni1o',
    url: 'https://jwb.dpinfo.com.cn:9100/data/demc',
    isTerrain: 1,
    kind: 19,
    visible: true,
    imgurl: 'baseLayerImgs/terrin.jpg',
  },
]
//白膜地址
const baimoLayer = {
  label: '白膜',
  pid: 1000,
  //url: 'http://192.168.1.250:9003/model/tzNjBKx6e/tileset.json',
  url: 'https://jwb.dpinfo.com.cn:9100/data/jzbmc/tileset.json ',
  kind: 16,
  visible: true,
  //imgurl:"../baseLayerImgs/terrin.jpg",
}

window.apiURL = apiURL
window.accuracy = accuracy
window.fileURL = fileURL
window.tourServerUrl = tourServerUrl
// window.midApiURL = midApiURL
window.cesiumToken = cesiumToken
window.baseLayerDatas = baseLayerDatas
window.viewer = null
const taskoverReload = false
