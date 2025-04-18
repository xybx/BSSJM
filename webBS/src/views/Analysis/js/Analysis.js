import * as Cesium from 'cesium/Cesium'
import * as widgets from 'cesium/Widgets/widgets.css'
import { mapInit } from '@/utils/mapInit'

import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import aplayer from 'vue-aplayer'
import { mapGetters } from 'vuex'
import MapTool from '@/components/map/tool/Tool.vue'
import { getMattersinTypes } from '../api/analysis-api'
import {
  getTaskTail,
  getTaskIdea,
  getTaskList,
} from '../../Taskwork/api/taskwork'

//const Base64 = require('crypto-js/enc-base64')

export default {
  name: 'Analysis',
  data() {
    return {
      tabCard: 'baseinfo',
      points: [],
      typelist: [],
      selectTypes: [],
      relituIconFocus: false,
      heatmapSelectVisible: false,
      heatmapTypeFocus: false,
      heatmapMiduFocus: false,
      layerDialog: {
        visible: false,
      },
      formData: {},
      flowData: [],
      imgdata: [],
      urldata: [],
      audioList: [],
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'video/mp4', // 类型
            src: '', // url地址
          },
        ],
        poster: '', // 封面地址
        notSupportedMessage: '用户未上传视频', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
      attr: {
        visible: false,
        detailVisible: false,
        currTypeId: '',
        List: [],
        currData: '',
        SelData: {},
        TableData: [],
        attrTable: [
          // {
          //   pid: 1,
          //   label: '2016-05-02',
          //   value: '王小虎',
          // },
        ],
      },
      searchDialog: {
        visible: false,
        searchForm: {
          typeid: '',
          areacode: '',
          username: '',
          querydate: '',
          type: '',
        },
        searchResult: [],
        curLocationPid: 0,
        prevClickPid: 0,
        handler: null,
      },
    }
  },
  components: { MapTool, videoPlayer, aplayer },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    },
    ...mapGetters({
      token: 'user/token',
    }),
  },
  watch: {
    relituIconFocus: function (val) {
      //console.log(val, 'relituIconFocus')
      if (!val) {
        let heatmapEntity = window.viewer.entities.getById('heatmap')
        if (heatmapEntity) {
          window.viewer.entities.remove(heatmapEntity)
        }
      }
    },
  },
  beforeDestroy() {
    console.log(window.viewer, 11111)
    if (window.viewer) {
      // window.viewer.destroy()
      // window.viewer = null
      // if (window.viewer.tileset) {
      //   window.viewer.tileset =
      //   window.viewer.tileset && window.viewer.tileset.destroy()
      // }
      window.viewer.entities.removeAll()
      window.viewer.scene.primitives.removeAll()
      if (mapInit.handler) {
        mapInit.handler.destroy()
        mapInit.handler = null
      }
      // 获取webgl上下文
      let gl = window.viewer.scene.context._originalGLContext
      // 当canvas大小改变时，页面就会自动刷新
      gl.canvas.width = 1
      gl.canvas.height = 1
      window.viewer = window.viewer && window.viewer.destroy()
      // 销毁webgl上下文
      gl.getExtension('WEBGL_lose_context').loseContext()
      gl = null
    }
  },
  created() {},
  mounted() {
    //初始化地图
    mapInit.init()
    //获取类型数据
    this.getMattersinTypeList()
    this.attrQuery()
    this.loadXZQGeojson()
    //mapInit.createHeatMap(this.points)
    // console.log(window.viewer, 'viewer')
  },
  methods: {
    //加载（图层树）类型数据
    getMattersinTypeList: async function () {
      let res = await getMattersinTypes()
      //console.log(res, 'res')
      if (res.code == 200) {
        //this.typelist = res.data
        res.data.forEach((t) => {
          let iconUrl = mapInit.getMatterTypeIconUrl(t)
          this.typelist.push(Object.assign(t, { checked: true }))

          t.matters.forEach((m) => {
            // if (m.repconten!=null && m.repconten!='') {
            //   let Base64 = require('js-base64').Base64
            //   let content = Base64.decode(m.repconten)
            //   m.repconten = content
            // }
            m.typename = t.name
            //类型权重
            Object.assign(m, { typevalue: t.quanzhong })
            if (m.latitude && m.longitude) {
              this.points.push(m)
              mapInit.addSinglePoint(m, iconUrl)
            }
          })
        })
        // console.log(this.typelist, 'this.typelist')
        // console.log(this.points, 'this.points')
      } else {
        this.points = []
        this.typelist = []
      }
      mapInit.points = this.points
      mapInit.typelist = this.typelist
    },
    selctHeatMap: function () {
      this.relituIconFocus = !this.relituIconFocus
      this.heatmapSelectVisible = this.relituIconFocus
      if (this.relituIconFocus) {
        this.layerDialog.visible = false
        this.searchDialog.visible = false
        this.searchDialog.searchForm.typeid = ''
        this.searchDialog.searchForm.areacode = ''
        this.searchDialog.searchForm.username = ''
        this.searchDialog.searchForm.querydate = ''
        this.searchDialog.searchForm.type = ''
      }
    },
    //加载热力图
    loadHeatMap: function (type) {
      debugger
      let heatmapEntity = window.viewer.entities.getById('heatmap')
      if (heatmapEntity) {
        window.viewer.entities.remove(heatmapEntity)
      }
      if (type == 1) {
        if (this.points.length == 0) {
          return this.$message.warning('目前未有上报事件！！！')
        }
        this.heatmapTypeFocus = true
        this.heatmapMiduFocus = !this.heatmapTypeFocus
        mapInit.createHeatMapByType(this.points)
      } else if (type == 2) {
        if (this.points.length == 0) {
          return this.$message.warning('目前未有上报事件！！！')
        }
        this.heatmapMiduFocus = true
        this.heatmapTypeFocus = !this.heatmapMiduFocus
        mapInit.createHeatMapDotdensity(this.points)
      }
      // this.relituIconFocus = !this.relituIconFocus
      // if (!this.relituIconFocus) {
      //   let heatmapEntity = window.viewer.entities.getById('heatmap')
      //   if (heatmapEntity) {
      //     window.viewer.entities.remove(heatmapEntity)
      //   }
      // } else {
      //   this.layerDialog.visible = false
      //   this.searchDialog.visible = false
      //   if (this.points.length) {
      //     mapInit.createHeatMapDotdensity(this.points)
      //   }
      // }
    },
    //加载图层树
    loadLayer: function () {
      this.layerDialog.visible = !this.layerDialog.visible
      if (this.layerDialog.visible) {
        this.searchDialog.visible = false
        this.relituIconFocus = false
        this.heatmapSelectVisible = false
        this.heatmapTypeFocus = false
        this.heatmapMiduFocus = false
        this.searchDialog.searchForm.typeid = ''
        this.searchDialog.searchForm.areacode = ''
        this.searchDialog.searchForm.username = ''
        this.searchDialog.searchForm.querydate = ''
        this.searchDialog.searchForm.type = ''
      }
    },
    //图层选中
    layerChange: function (objs) {
      //console.log(objs,this.selectTypes,'objs')

      mapInit.clearGeo()
      this.typelist.forEach((t) => {
        if (objs.indexOf(t.pid) < 0) {
          t.matters.forEach((m) => {
            let entity = window.viewer.entities.getById(m.pid)
            if (entity) {
              window.viewer.entities.remove(entity)
            }
          })
        } else {
          t.matters.forEach((m) => {
            let iconUrl = mapInit.getMatterTypeIconUrl(t)
            let entity = window.viewer.entities.getById(m.pid)
            if (!entity) {
              mapInit.addSinglePoint(m, iconUrl)
            }
          })
        }
        // if (t.checked) {
        //   console.log(t, 't')
        //   mapInit.addLayerTreePoints(t)
        // }
      })
      //console.log(obj,'check')
    },
    //移除上一个高亮点，返回原来的符号
    removePrevHightPoint: function (pointId) {
      if (pointId) {
        //渲染原来的符号
        this.points.forEach((p) => {
          if (p.pid == pointId) {
            let iconUrl = require('@/assets/layerTypeIcons/default.png')
            let typeObj = this.typelist.filter((t) => t.pid == p.typeid)
            if (typeObj.length > 0) {
              iconUrl = mapInit.getMatterTypeIconUrl(typeObj[0])
            }
            //移除高亮点
            let searchCurEntity = window.viewer.entities.getById(pointId)
            if (searchCurEntity) {
              searchCurEntity._billboard._image._value = iconUrl
              //window.viewer.entities.remove(searchCurEntity)
            } else {
              mapInit.addSinglePoint(p, iconUrl)
            }
          }
        })
      }
    },
    //属性查询
    attrQuery: function () {
      let app = this
      let startPick = null
      let prevId = 0
      if (mapInit.handler != null) {
        mapInit.handler.destroy()
        mapInit.handler = null
      }
      if (mapInit.attrHandler != null) {
        mapInit.attrHandler.destroy()
        mapInit.attrHandler = null
      }
      if (mapInit.attrHandler) {
        if (startPick) {
          startPick.color = new Cesium.Color(1, 1, 1)
        }
        mapInit.attrHandler.destroy()
        mapInit.attrHandler = null
      }
      mapInit.attrHandler = new Cesium.ScreenSpaceEventHandler(
        window.viewer.scene.canvas
      )
      mapInit.attrHandler.setInputAction(async (evt) => {
        debugger
        if (mapInit.isMeasureHandler) {
          return
        }
        if (app.searchDialog.curLocationPid) {
          // let searchCurEntity = window.viewer.entities.getById(
          //   app.searchDialog.curLocationPid
          // )
          // if (searchCurEntity) {
          //   window.viewer.entities.remove(searchCurEntity)
          // }
          app.removePrevHightPoint(app.searchDialog.curLocationPid)
        }
        app.attr.List = []
        // 清空属性下拉框
        app.attr.currTypeId = ''
        if (app.attr.SelData) {
          //if (app.attr.SelData.id) {
          let prevEntity = window.viewer.entities.getById(app.attr.SelData.pid)
          if (prevEntity) {
            //let p = startPick.id.properties.getValue()
            //window.viewer.entities.remove(prevEntity)
            app.points.forEach((p) => {
              if (p.pid == app.attr.SelData.pid) {
                let iconUrl = require('@/assets/layerTypeIcons/default.png')
                let typeObj = app.typelist.filter((t) => t.pid == p.typeid)
                if (typeObj.length > 0) {
                  iconUrl = mapInit.getMatterTypeIconUrl(typeObj[0])
                }
                prevEntity._billboard._image._value = iconUrl
                //mapInit.addSinglePoint(p, iconUrl)
              }
            })
            //}
          }
        }
        debugger
        //var cartesian = window.viewer.scene.pickPosition(evt.position)
        //拾取单个实体对象
        // let pick = window.viewer.scene.pick(evt.position)
        // console.log(pick, 'pick')
        //拾取多个实体对象
        let picks = window.viewer.scene.drillPick(evt.position)
        // let locationPick = viewer.scene.pickPosition(evt.position)
        // let pickRay = viewer.camera.getPickRay(evt.position)
        // var position = viewer.scene.globe.pick(pickRay, window.viewer.scene)

        // console.log(window.viewer.selectedEntity, 'selectedEntity')
        // console.log(picks, 'pick')
        //console.log(pick, 'pick')
        // let alti = window.viewer.camera.positionCartographic.height

        for (let i = 0; i < picks.length; i++) {
          app.attr.attrTable = []
          const pick = picks[i]
          if (Cesium.defined(pick)) {
            console.log(pick, 'pick')
            if (!pick.id) {
              continue
            }
            if (pick.id.name == 'dataPoint') {
              app.attr.visible = true
            } else {
              if (app.attr.List.length == 0) {
                app.attr.visible = false
              }
              continue
            }
            prevId = pick.id.id
            // geojson
            if (pick.id) {
              //获取当前点的属性信息
              if (pick.id.properties) {
                let p = pick.id.properties.getValue()
                // if (pick.id.properties.hasProperty('pid')) {
                //   app.attr.attrTable.push({
                //     pid: p.pid,
                //     label: '事项id',
                //     value: p.pid,
                //   })
                // }
                // if (pick.id.properties.hasProperty('name')) {
                //   app.attr.attrTable.push({
                //     pid: p.pid,
                //     label: '事项名称',
                //     value: p.name,
                //   })
                // }
                if (pick.id.properties.hasProperty('typename')) {
                  app.attr.attrTable.push({
                    pid: p.pid,
                    label: '事项类别',
                    value: p.typename,
                  })
                }
                if (pick.id.properties.hasProperty('repconten')) {
                  app.attr.attrTable.push({
                    pid: p.pid,
                    label: '事项内容',
                    value: p.repconten,
                  })
                }
                if (pick.id.properties.hasProperty('type')) {
                  app.attr.attrTable.push({
                    pid: p.pid,
                    label: '处理类型',
                    value: p.type,
                  })
                }
                if (pick.id.properties.hasProperty('startdate')) {
                  app.attr.attrTable.push({
                    pid: p.pid,
                    label: '上报时间',
                    value: p.startdate,
                  })
                }
                if (pick.id.properties.hasProperty('username')) {
                  app.attr.attrTable.push({
                    pid: p.pid,
                    label: '上报人',
                    value: p.username,
                  })
                }
                if (app.attr.attrTable.length > 0) {
                  app.attr.attrTable.push({
                    pid: p.pid,
                    label: '操作',
                    value: '查看详细',
                  })
                }
                // let objectData = Object.assign(app.attr.attrTable, {
                //   entity: pick,
                // })
                // app.attr.List.push(app.attr.attrTable)
                let tablerow = {
                  attrTable: app.attr.attrTable,
                  entity: pick,
                  pid: p.pid,
                  startdate: p.startdate,
                  typeid: p.typeid,
                  longitude: p.longitude,
                  latitude: p.latitude,
                }
                app.attr.List.push(tablerow)
              }
            } else {
            }
          } else {
          }
          if (app.attr.List.length > 0) {
            app.attr.SelData = app.attr.List[0]
            app.attr.currData = app.attr.SelData.pid
            mapInit.curGlPointId = app.attr.SelData.pid
            //当前点击点高亮显示
            let curEntity = window.viewer.entities.getById(app.attr.SelData.pid)
            if (curEntity) {
              //  let dataPoint = app.attr.List.filter(
              //    (s) => s.pid == app.attr.SelData.pid
              //  )[0]
              //window.viewer.entities.remove(curEntity)
              let iconUrl = require('@/assets/layerTypeIcons/curDefault.png')
              //curEntity.billboard.image = iconUrl
              let cur_pointdata = app.points.filter(
                (p) => p.pid == app.attr.currData
              )[0]
              curEntity._billboard._image._value = iconUrl
              // curEntity = mapInit.addSinglePoint(
              //   cur_pointdata,
              //   iconUrl,
              //   'glPoint'
              // )
              let hightLightPoint =
                window.viewer.entities.getById('highlight_point')
              if (!hightLightPoint) {
                hightLightPoint = mapInit.addSingleAlertMarker(
                  cur_pointdata,
                  iconUrl
                )
              }
              hightLightPoint.position = curEntity.position
              //mapInit.addSinglePoint(app.attr.SelData, iconUrl)
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    //属性查询下拉选择
    attrChange: function (obj) {
      let hightLightPoint = window.viewer.entities.getById('highlight_point')
      if (this.attr.currData) {
        this.removePrevHightPoint(this.attr.currData)
      }
      //console.log(obj, this.attr.currData, 'obj')
      if (this.attr.currData != this.attr.SelData.pid) {
        let entity = window.viewer.entities.getById(this.attr.SelData.pid)

        //上一点选中图标返回原来icon
        let iconUrl = require('@/assets/layerTypeIcons/default.png')
        let typeObj = this.typelist.filter(
          (t) => t.pid == this.attr.SelData.typeid
        )
        if (typeObj.length > 0) {
          iconUrl = mapInit.getMatterTypeIconUrl(typeObj[0])
        }
        let pointdata = this.points.filter(
          (p) => p.pid == this.attr.SelData.pid
        )[0]
        if (entity) {
          entity._billboard._image._value = iconUrl
        } else {
          mapInit.addSinglePoint(pointdata, iconUrl)
        }

        //当前选中点
        let currObj = this.attr.List.filter(
          (p) => p.pid == this.attr.currData
        )[0]
        let curentity = window.viewer.entities.getById(this.attr.currData)
        let curiconUrl = require('@/assets/layerTypeIcons/curDefault.png')
        //mapInit.addSinglePoint(currObj, curiconUrl)
        let cur_pointdata = this.points.filter((p) => p.pid == currObj.pid)[0]
        if (curentity) {
          curentity._billboard._image._value = iconUrl
          //window.viewer.entities.remove(curentity)
        } else {
          mapInit.addSinglePoint(cur_pointdata, curiconUrl)
        }

        this.attr.SelData = currObj
        if (!hightLightPoint) {
          hightLightPoint = mapInit.addSingleAlertMarker(cur_pointdata, iconUrl)
        }
        hightLightPoint.position = entity.position
      }
    },
    lookDetils: async function (pid) {
      //console.log(pid, 'pid')
      this.attr.detailVisible = true
      let res = await getTaskTail({ pid: pid })
      if (res.code == 200) {
        this.formData = res.data
        if (res.data.arepimage && res.data.arepimage.length) {
          this.imgdata = res.data.arepimage.split(',').map((item) => {
            return `${this.$baseUrl}/gridfs/image/${item}?token=${this.token}`
          })
        } else {
          this.imgdata = []
        }
        if (res.data.adminimages && res.data.adminimages.length) {
          this.urldata = res.data.adminimages.split(',').map((item) => {
            return `${this.$baseUrl}/gridfs/image/${item.fileid}`
          })
        } else {
          this.urldata = []
        }
        if (res.data.arepyuyin && res.data.arepyuyin != '') {
          this.audioList = res.data.arepyuyin.split(',').map((item) => {
            return {
              title: '未知',
              src: `${this.$baseUrl}/gridfs/downloadFile/${item}?token=${this.token}`,
            }
          })
        }
        if (res.data.arepvideo && res.data.arepvideo != '') {
          this.$nextTick(() => {
            this.playerOptions.sources[0].src = `${this.$baseUrl}/gridfs/downloadFile/${res.data.arepvideo}?token=${this.token}`
          })
        }
        let dataitems = this.points.filter((p) => p.pid == pid)
        if (dataitems.length > 0) {
          this.formData.typename = dataitems[0].typename
        }
      } else {
        this.$message.warning('没有此条数据！')
        return false
      }
      this.getIdea(pid)
    },
    async getIdea(pid) {
      let res = await getTaskIdea({ pid: pid })
      this.flowData = res.data.length > 0 ? res.data : []
    },
    tabChange(val) {
      this.tabCard = val
    },
    handleClose() {
      //this.title = ''
      this.formData = this.$options.data().formData
      this.tabCard = 'baseinfo'
      this.attr.detailVisible = false
    },
    //搜素哦
    loadSearchDialog() {
      this.searchDialog.visible = !this.searchDialog.visible
      if (this.searchDialog.visible) {
        this.layerDialog.visible = false
        this.relituIconFocus = false
        this.heatmapSelectVisible = false
        this.heatmapTypeFocus = false
        this.heatmapMiduFocus = false
      } else {
        this.searchDialog.searchForm.typeid = ''
        this.searchDialog.searchForm.areacode = ''
        this.searchDialog.searchForm.username = ''
        this.searchDialog.searchForm.querydate = ''
        this.searchDialog.searchForm.type = ''
      }
    },

    //搜索
    async getListData() {
      debugger
      this.searchDialog.searchResult = []
      let params = {
        pagenumber: 1,
        pagesize: 100,
      }
      if (this.searchDialog.searchForm.typeid) {
        Object.assign(params, { typeid: this.searchDialog.searchForm.typeid })
      }
      if (this.searchDialog.searchForm.areaname) {
        Object.assign(params, {
          areaname: this.searchDialog.searchForm.areaname,
        })
      }
      if (this.searchDialog.searchForm.username) {
        Object.assign(params, {
          username: this.searchDialog.searchForm.username,
        })
      }
      if (this.searchDialog.searchForm.querydate) {
        let date = new Date(this.searchDialog.searchForm.querydate[0])
        let _sdate =
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate()
        Object.assign(params, {
          startdate: _sdate,
        })

        let edate = new Date(this.searchDialog.searchForm.querydate[1])
        let _edate =
          edate.getFullYear() +
          '-' +
          (edate.getMonth() + 1) +
          '-' +
          edate.getDate()

        if (_sdate == _edate) {
          _edate =
            edate.getFullYear() +
            '-' +
            (edate.getMonth() + 1) +
            '-' +
            (edate.getDate() + 1)
          Object.assign(params, {
            enddate: _edate,
          })
        } else {
          Object.assign(params, {
            enddate: _edate,
          })
        }
      }

      if (this.searchDialog.searchForm.type) {
        Object.assign(params, { type: this.searchDialog.searchForm.type })
      }

      let res = await getTaskList(params)
      console.log(res, 'res')
      if (res.code === 200) {
        res.data.list.forEach((d) => {
          let type = this.typelist.filter((p) => p.pid == d.typeid)[0]
          let data = d
          // if (data.typeid) {

          // }
          let iconUrl = null
          let typeObj = this.typelist.filter((t) => t.pid == data.typeid)
          if (typeObj.length > 0) {
            iconUrl = mapInit.getMatterTypeIconUrl(typeObj[0])
          }
          // if (type.icon) {
          //  // data = Object.assign(d, { imgurl: type.icon })
          // } else {

          data = Object.assign(d, { imgurl: iconUrl })
          //}
          // if (data.repconten!=null && data.repconten!='') {
          //   let Base64 = require('js-base64').Base64
          //   let content = Base64.decode(data.repconten)
          //   data.repconten = content
          // }
          this.searchDialog.searchResult.push(data)
        })
        console.log(this.searchDialog.searchResult, 'searchResult')
        //this.searchDialog.searchResult = res.data.list
        //this.total = res.data.total
        if (res.data.list.length == 0) {
          this.$message({
            message: '未查询到数据！',
            // type: 'error',
          })
        }
      } else {
        this.searchDialog.searchResult = []
        this.$message({
          message: '查询出错！',
          type: 'error',
        })
      }
      // setTimeout(() => {
      //   this.tabloading = false
      // }, 200)
    },
    //定位
    locationPoint(data) {
      this.searchDialog.curLocationPid = data.pid

      let hightLightPoint = window.viewer.entities.getById('highlight_point')

      if (this.attr.currData) {
        this.removePrevHightPoint(this.attr.currData)
      }
      let entity = window.viewer.entities.getById(data.pid)
      if (entity) {
        if (Number(data.longitude) <= 0 && Number(data.latitude) <= 0) {
          return this.$message({
            message: '该事件未获取到位置信息',
            type: 'warning',
          })
        }
        let iconUrl = require('@/assets/layerTypeIcons/curDefault.png')
        entity._billboard._image._value = iconUrl
        //entity = mapInit.addSinglePoint(data, iconUrl, 'glPoint')
        if (!hightLightPoint) {
          hightLightPoint = mapInit.addSingleAlertMarker(data, iconUrl)
        }
        hightLightPoint.position = entity.position

        mapInit.lookAt(entity.position._value)
        if (this.searchDialog.prevClickPid > 0) {
          let preventity = window.viewer.entities.getById(
            this.searchDialog.prevClickPid
          )
          if (preventity) {
            window.viewer.entities.remove(preventity)
            let prevdata = this.points.filter(
              (p) => p.pid == this.searchDialog.prevClickPid
            )[0]
            let iconUrl = require('@/assets/layerTypeIcons/default.png')
            let typeObj = this.typelist.filter((t) => t.pid == prevdata.typeid)
            if (typeObj.length > 0) {
              iconUrl = mapInit.getMatterTypeIconUrl(typeObj[0])
            }
            preventity._billboard._image._value = iconUrl
            //preventity = mapInit.addSinglePoint(prevdata, iconUrl)
          }
        }
      } else {
        if (Number(data.longitude) > 0 && Number(data.latitude) > 0) {
          let iconUrl = require('@/assets/layerTypeIcons/curDefault.png')
          entity = mapInit.addSinglePoint(data, iconUrl)
          //entity = mapInit.addSinglePoint(data, iconUrl, 'dataPoint', 48)

          if (!hightLightPoint) {
            hightLightPoint = mapInit.addSingleAlertMarker(data, iconUrl)
          }
          hightLightPoint.position = entity.position
          mapInit.lookAt(entity.position._value)
        } else {
          this.$message({
            message: '该事件未获取到位置信息',
            type: 'warning',
          })
        }
      }
      //if (this.searchDialog.prevClickPid == 0) {
      this.searchDialog.prevClickPid = data.pid

      //}
    },
    //加载行政区geojson数据
    loadXZQGeojson() {
      let geojsonFile = 'data/XZQXZ_BS.json'
      mapInit.loadGeoJson(geojsonFile, true)
    },
  },
}
