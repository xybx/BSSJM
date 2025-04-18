<template>
  <div class="tool">
    <div
      class="option"
      v-for="item in toolList"
      :key="item.code"
      @click="handleTool(item)"
      :class="{ 'tool-focus': item.isFocus }"
    >
      <span class="iconfont" :class="item.icon"></span>
      {{ item.label }}
    </div>

    <!-- 量算 -->
    <el-dialog
      title="量算"
      :visible.sync="measureVisible"
      width="30%"
      :modal="false"
      class="tool-measure"
      @close="closeMeasure"
      v-dialogDrag
    >
      <div class="tool-main">
        <div
          class="tool-item"
          v-for="(item, index) in measureList"
          :key="index"
          @click="handleMeasure(item)"
          :class="{
            'measure-focus': item.isFocus,
          }"
        >
          <span class="base-img">
            <i class="iconfont" :class="item.icon"></i>
          </span>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </el-dialog>
    <!-- 底图 -->
    <!-- 工具栏-底图 -->
    <el-dialog
      :visible.sync="baseVisible"
      :modal="false"
      width="20%"
      :close-on-click-modal="false"
      class="tool-basemap"
      @close="closeBasemap"
      title="底图"
      v-dialogDrag
    >
      <div class="tool-main">
        <div
          class="tool-item"
          v-for="(item, index) in baseLayerDatas"
          :key="index"
          @click="handleBaseLayer(item)"
          :class="item.visible ? 'focus-base' : ''"
        >
          <span class="base-img">
            <el-image :src="item.imgurl" fit="fill" />
          </span>
          <span class="base-label">{{ item.label }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
  import * as Cesium from 'cesium'
  // 页面分离
  import {
    verline1,
    verline2,
    toolList,
    measureList,
    getSpaceDistance,
    verticalLinemove,
    getLengthText,
    verfuzhuPoint,
    flag,
  } from './toolFun'
  import { mapInit } from '@/utils/mapInit'
  import { mapTool } from '@/utils/mapTool.js'
  export default {
    name: 'maptool',
    data() {
      return {
        toolList: [],
        measureList: [],
        toolVisible: true,
        measureVisible: false,
        baseVisible: false,
        baseLayerDatas: [],
        positions: [],
        handler: null,
        tips: null, //量算鼠标移动提示信息
      }
    },
    computed: {},
    created() {},
    mounted() {
      this.toolList = toolList
      this.measureList = measureList
      this.baseLayerDatas = baseLayerDatas.filter((p) => p.isTerrain != 1)
      //console.log(this.baseLayerDatas, "this.baseLayerDatas");
    },
    methods: {
      handleTool: function (item) {
        toolList.forEach((t) => {
          t.isFocus = false
        })
        if (item.code != 'qc') {
          item.isFocus = !item.isFocus
        }
        switch (item.code) {
          case 'qt':
            mapInit.locationCenter()
            //handleAttr(item)
            break
          case 'qc':
            this.clearGeo()
            break
          case 'dt':
            this.toggleBase(item)
            break
          case 'ls':
            this.toggleMeasure(item)
            break
          default:
            break
        }
      },
      toggleMeasure(item) {
        this.closeBasemap()
        this.measureVisible = item.isFocus
      },
      toggleBase(item) {
        this.closeMeasure()
        this.baseVisible = item.isFocus
      },
      closeMeasure() {
        this.measureVisible = false
      },
      closeBasemap() {
        this.baseVisible = false
      },
      // 组装底图图片路径
      //  returnIconUrl (item: any)  {
      //   return window.apiResource + item.iconUrl;
      // },
      // 关闭
      /* 清除 */
      clearGeo: function () {
        if (mapInit.handler) {
          mapInit.handler.destroy()
          mapInit.handler = null
        }
        mapInit.clearGeo()
        //window.viewer.entities.removeAll();
      },
      //切换底图
      handleBaseLayer: async function (item) {
        item.visible = !item.visible
        if (item.visible) {
          if (item.isTerrain == 1) {
            let terrainProvider = await new Cesium.CesiumTerrainProvider({
              url: item.url,
              requestVertexNormals: true,
            })
            // if (isCesiumAdvancedVersion) {
            //   let terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(item.url);
            // }
            window.viewer.terrainProvider = terrainProvider
          } else {
            debugger
            this.baseLayerDatas.filter((baseLayer) => {
              if (baseLayer.pid != item.pid && baseLayer.isTerrain == 0) {
                baseLayer.visible = false
              }
            })
            window.viewer.imageryLayers.removeAll()
            await mapInit.initLayerByKind(item, true)
          }
        } else {
          if (item.isTerrain == 1) {
            let terrainProvider = new Cesium.EllipsoidTerrainProvider({})
            window.viewer.terrainProvider = terrainProvider
          } else {
            window.viewer.imageryLayers.removeAll()
          }
        }
      },
      //量算事件
      handleMeasure: function (item) {
        // debugger;
        // this.handler = mapInit.handler
        // if (mapInit.attrHandler) {
        //   mapInit.attrHandler.destroy()
        //   mapInit.attrHandler = null
        // }
        if (mapInit.handler) {
          this.closeMeasureEvent()
          this.tips = window.viewer.entities.getById('tipEntity')
          if (this.tips) {
            window.viewer.entities.remove(this.tips)
          }
        }
        if (item.isFocus) {
          if (mapInit.handler) {
            mapInit.handler.destroy()
          }
          item.isFocus = !item.isFocus
          return false
        }
        item.isFocus = !item.isFocus
        this.measureList.filter((measureItem) => {
          // console.log(measureItem, "measureItem");
          if (measureItem.code != item.code) {
            measureItem.isFocus = false
          }
        })

        switch (item.code) {
          case 'spjl':
            //水平距离
            mapInit.isMeasureHandler = true
            this.measureHorizontal(item)
            break
          case 'czjl':
            //垂直距离
            mapInit.isMeasureHandler = true
            this.measureVertical(item)
            break
          case 'kjjl':
            //空间距离
            mapInit.isMeasureHandler = true
            this.measureSpatial(item)
            break
          case 'mjls':
            //面积量算
            mapInit.isMeasureHandler = true
            this.measureArea(item)
            break
          case 'sjcl':
            //三角测量
            mapInit.isMeasureHandler = true
            this.verticalDistance()
            break
          case 'jjcl':
            //夹角测量
            mapInit.isMeasureHandler = true
            this.Anglemeasurement()
            break
          default:
            break
        }
      },
      //水平距离
      measureHorizontal: function (item) {
        let app = this
        let measurePos = []
        // 存储标签
        let label = null
        mapInit.handler = new Cesium.ScreenSpaceEventHandler(
          window.viewer.scene.canvas
        )
        // 注册鼠标左击事件
        mapInit.handler.setInputAction((evt) => {
          // 获得点击坐标
          var cartesian = window.viewer.scene.pickPosition(evt.position)
          if (cartesian == undefined) {
            return false
          }
          if (!cartesian) return
          measurePos.push(cartesian.clone())
          if (measurePos.length >= 2) {
            measurePos.pop()
            measurePos.push(cartesian.clone())
            mapTool.addLine(measurePos, true)
            label = mapTool.addLabel(
              measurePos[measurePos.length - 1],
              getSpaceDistance(measurePos)
            )
          }
          mapTool.addPoint(measurePos[measurePos.length - 1])
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        mapInit.handler.setInputAction((evt) => {
          // 获得坐标
          var cartesian = window.viewer.scene.pickPosition(evt.endPosition)
          mapTool.addTips(cartesian, '单击绘制折线\n右键结束绘制')

          if (!cartesian) return
          if (measurePos.length >= 2) {
            measurePos.pop()
            measurePos.push(cartesian.clone())
          } else if (measurePos.length === 1) {
            measurePos.push(cartesian.clone())
            mapTool.addLine(measurePos, true)
            label = mapTool.addLabel(
              measurePos[0],
              getSpaceDistance(measurePos)
            )
          }
          if (label) {
            label.label.text.setValue(getSpaceDistance(measurePos))
            label.position.setValue(measurePos[measurePos.length - 1])
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        mapInit.handler.setInputAction((evt) => {
          app.tips = window.viewer.entities.getById('tipEntity')
          if (app.tips) {
            window.viewer.entities.remove(app.tips)
          }
          window.viewer.entities.remove(label)
          measurePos.pop()
          mapInit.handler.destroy()
          mapInit.handler = null

          app.measureList.filter((measureItem) => {
            measureItem.isFocus = false
          })
          mapInit.isMeasureHandler = false
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
      },
      //垂直距离
      measureVertical: function (item) {
        let app = this
        var positions = []
        // let verline1 = null
        // let verline2 = null
        let label = null
        mapInit.handler = new Cesium.ScreenSpaceEventHandler(
          window.viewer.scene.canvas
        )
        // 注册鼠标左击事件
        mapInit.handler.setInputAction((clickEvent) => {
          var cartesian = window.viewer.scene.pickPosition(clickEvent.position) // 坐标
          console.log(cartesian, '垂直距离')
          if (cartesian == undefined) {
            return false
          }

          // 存储第一个点
          if (positions.length == 0) {
            if (!cartesian) {
              return false
            }
            positions.push(cartesian.clone())
            mapTool.addPoint(cartesian)

            // 注册鼠标移动事件
            mapInit.handler.setInputAction((moveEvent) => {
              var movePosition = window.viewer.scene.pickPosition(
                moveEvent.endPosition
              ) // 鼠标移动的点
              mapTool.addTips(movePosition, '单击绘制折线\n右键结束绘制')

              if (!movePosition) {
                return false
              }
              if (positions.length >= 2) {
                // positions.pop();

                verfuzhuPoint(movePosition, false, positions)

                // 计算距离
                var lengthText_2 = '垂直距离：' + getLengthText(positions, flag)
              } else {
                var verticalPoint = new Cesium.Cartesian3(
                  movePosition.x,
                  movePosition.y,
                  positions[0].z
                )
                positions.push(verticalPoint)
                positions.push(movePosition)
                // var lastpoint = new Cesium.Cartesian3(
                //   positions[0].x,
                //   positions[0].y,
                //   movePosition.z
                // );
                // positions.push(lastpoint);

                // 绘制线
                console.log(positions)

                verticalLinemove(positions)

                // 计算距离
                var lengthText_2 = '垂直距离：' + getLengthText(positions, flag)
                label = mapTool.addLabel(
                  positions[positions.length - 1],
                  lengthText_2
                )
              }
              if (label) {
                label.label.text.setValue(
                  '垂直距离：' + getLengthText(positions, flag)
                )
                label.position.setValue(positions[positions.length - 1])
              }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
          } else {
            verfuzhuPoint(cartesian, true, positions)
            // positions.push(positions[0])
            // positions.push(positions[0])
            // positions.push(positions[0])
            label = mapTool.addLabel(
              positions[positions.length - 1],
              getLengthText(positions, flag)
            )
            mapTool.addPoint(cartesian)
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        mapInit.handler.setInputAction(() => {
          mapInit.handler.destroy()
          console.log(2)
          mapInit.handler = null
          console.log(3)
          app.tips = window.viewer.entities.getById('tipEntity')
          if (app.tips != null) {
            window.viewer.entities.remove(app.tips)
          }
          console.log(
            window.viewer.entities,
            verline1,
            'window.viewer.entities'
          )
          window.viewer.entities.remove(verline1)
          console.log(5)
          window.viewer.entities.remove(verline2)
          // console.log(6)
          window.viewer.entities.remove(label)
          positions.pop()
          positions.pop()
          // console.log(7)

          app.measureList.filter((measureItem) => {
            measureItem.isFocus = false
          })
          mapInit.isMeasureHandler = false
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
      },
      //空间距离
      measureSpatial: function (item) {
        let app = this
        let positions = []
        // 存储标签
        let label = null
        mapInit.handler = new Cesium.ScreenSpaceEventHandler(
          window.viewer.scene.canvas
        )
        // 注册鼠标左击事件
        mapInit.handler.setInputAction((evt) => {
          // // 获得点位置
          var cartesian = window.viewer.scene.pickPosition(evt.position)
          if (!cartesian) return
          positions.push(cartesian.clone())
          if (positions.length >= 2) {
            positions.pop()
            positions.push(cartesian.clone())
            mapTool.addLine(positions)
            label = mapTool.addLabel(
              positions[positions.length - 1],
              '空间距离' + mapTool.getLength(positions)
            )
          }
          mapTool.addPoint(positions[positions.length - 1])
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        mapInit.handler.setInputAction((evt) => {
          var cartesian = window.viewer.scene.pickPosition(evt.endPosition)
          mapTool.addTips(cartesian, '单击绘制折线\n右键结束绘制')
          if (!cartesian) return
          if (positions.length >= 2) {
            positions.pop()
            positions.push(cartesian.clone())
          } else if (positions.length === 1) {
            positions.push(cartesian.clone())
            mapTool.addLine(positions)
            label = mapTool.addLabel(
              positions[0],
              '空间距离' + mapTool.getLength(positions)
            )
          }
          if (label) {
            label.label.text.setValue('空间距离' + mapTool.getLength(positions))
            label.position.setValue(positions[positions.length - 1])
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        mapInit.handler.setInputAction(() => {
          console.log(label, 'label')
          window.viewer.entities.remove(label)
          app.tips = window.viewer.entities.getById('tipEntity')
          if (app.tips != null) {
            window.viewer.entities.remove(app.tips)
          }
          positions.pop()
          mapInit.handler.destroy()

          mapInit.handler = null

          app.measureList.filter((measureItem) => {
            measureItem.isFocus = false
          })
          mapInit.isMeasureHandler = false
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
      },
      //面积量算
      measureArea: function (item) {
        let app = this
        let entityCollection = []
        let positions = []
        var clickStatus = false
        var labelEntity = null
        mapInit.handler = new Cesium.ScreenSpaceEventHandler(
          window.viewer.scene.canvas
        )
        mapInit.handler.setInputAction((clickEvent) => {
          clickStatus = true
          var cartesian = window.viewer.scene.pickPosition(clickEvent.position)
          if (cartesian == undefined) {
            return false
          }

          if (!cartesian) {
            return false
          }
          if (positions.length == 0) {
            positions.push(cartesian.clone()) //鼠标左击 添加第1个点
            mapTool.addPoint(cartesian)

            mapInit.handler.setInputAction((moveEvent) => {
              // 获得坐标
              var movePosition = window.viewer.scene.pickPosition(
                moveEvent.endPosition
              )
              mapTool.addTips(movePosition, '单击绘制折线\n右键结束绘制')
              if (!movePosition) {
                return false
              }
              if (positions.length == 1) {
                positions.push(movePosition)
                mapTool.addLine(positions, true)
              } else {
                if (clickStatus) {
                  positions.push(movePosition)
                } else {
                  positions.pop()
                  positions.push(movePosition)
                }
              }
              if (positions.length >= 3) {
                // 绘制label
                if (labelEntity) {
                  window.viewer.entities.remove(labelEntity)
                  entityCollection.splice(
                    entityCollection.indexOf(labelEntity),
                    1
                  )
                }
                var { surface: text, surfaceMu: text2 } =
                  mapTool.calcArea(positions)
                //var centerPoint = getCenterOfGravityPoint(positions)
                var centerPoint =
                  Cesium.BoundingSphere.fromPoints(positions).center
                labelEntity = mapTool.addLabel(
                  centerPoint,
                  text + '平方米 \n ' + text2,
                  1
                )
                entityCollection.push(labelEntity)
              }
              clickStatus = false
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
          } else if (positions.length == 2) {
            if (!cartesian) {
              return false
            }
            positions.pop()
            positions.push(cartesian.clone()) // 鼠标左击 添加第2个点

            mapTool.addPoint(cartesian)

            //添加面
            entityCollection.push(
              window.viewer.entities.add(
                new Cesium.Entity({
                  polygon: {
                    hierarchy: new Cesium.CallbackProperty(() => {
                      return new Cesium.PolygonHierarchy(positions)
                    }, false),
                    material: Cesium.Color.RED.withAlpha(0.6),
                    classificationType: Cesium.ClassificationType.BOTH, // 贴地表和贴模型,如果设置了，这不能使用挤出高度
                  },
                })
              )
            )
            //addPolyGon(positions)

            // 右击结束
            mapInit.handler.setInputAction(() => {
              app.tips = window.viewer.entities.getById('tipEntity')
              if (app.tips != null) {
                window.viewer.entities.remove(app.tips)
              }
              if (clickStatus == false && positions.length > 3) {
                positions.pop()
              }

              positions.push(positions[0]) // 闭合
              // console.log(789);
              //console.log(window.viewer);

              positions.map((item) => {
                let abc = Cesium.Cartographic.fromCartesian(item)
                window.viewer.scene.globe.getHeight(abc)
              })
              mapInit.handler.removeInputAction(
                Cesium.ScreenSpaceEventType.LEFT_CLICK
              )
              mapInit.handler.removeInputAction(
                Cesium.ScreenSpaceEventType.MOUSE_MOVE
              )
              mapInit.handler.removeInputAction(
                Cesium.ScreenSpaceEventType.RIGHT_CLICK
              )

              mapInit.handler = null

              app.measureList.filter((measureItem) => {
                measureItem.isFocus = false
              })
              mapInit.isMeasureHandler = false
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
          } else if (positions.length >= 3) {
            if (!cartesian) {
              return false
            }
            positions.pop()
            positions.push(cartesian.clone()) // 鼠标左击 添加第3个点
            mapTool.addPoint(cartesian)
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
      },
      //三角测量
      verticalDistance: function (item) {
        let app = this
        let entityCollection1 = []
        var positions = []
        var labelEntity_1 = null // 标签实体
        var labelEntity_2 = null // 标签实体
        var labelEntity_3 = null // 标签实体
        let lineLength = null
        let heightLength = null
        let hypotenuseLength = null
        mapInit.handler = new Cesium.ScreenSpaceEventHandler(
          window.viewer.scene.canvas
        )
        // 注册鼠标左击事件
        mapInit.handler.setInputAction((clickEvent) => {
          debugger
          var cartesian = window.viewer.scene.pickPosition(clickEvent.position) // 坐标
          if (cartesian == undefined) {
            return false
          }
          // 存储第一个点
          if (positions.length == 0) {
            if (!cartesian) {
              return false
            }
            positions.push(cartesian.clone())
            mapTool.addPoint(cartesian)

            // 注册鼠标移动事件
            mapInit.handler.setInputAction((moveEvent) => {
              var movePosition = window.viewer.scene.pickPosition(
                moveEvent.endPosition
              ) // 鼠标移动的点
              if (!movePosition) {
                return false
              }
              if (positions.length >= 2) {
                positions.pop()
                positions.pop()
                positions.pop()

                var cartographic =
                  Cesium.Cartographic.fromCartesian(movePosition)
                var height = Cesium.Cartographic.fromCartesian(
                  positions[0]
                ).height

                var verticalPoint = Cesium.Cartesian3.fromDegrees(
                  Cesium.Math.toDegrees(cartographic.longitude),
                  Cesium.Math.toDegrees(cartographic.latitude),
                  height
                )
                positions.push(verticalPoint)
                positions.push(movePosition)
                positions.push(positions[0])

                // 绘制label
                if (labelEntity_1) {
                  window.viewer.entities.remove(labelEntity_1)
                  entityCollection1.splice(
                    entityCollection1.indexOf(labelEntity_1),
                    1
                  )
                  window.viewer.entities.remove(labelEntity_2)
                  entityCollection1.splice(
                    entityCollection1.indexOf(labelEntity_2),
                    1
                  )
                  window.viewer.entities.remove(labelEntity_3)
                  entityCollection1.splice(
                    entityCollection1.indexOf(labelEntity_3),
                    1
                  )
                }

                // 计算中点
                var centerPoint_1 = Cesium.Cartesian3.midpoint(
                  positions[0],
                  positions[1],
                  new Cesium.Cartesian3()
                )
                // 计算距离
                lineLength = mapTool.getTwoPointsText(
                  positions[0],
                  positions[1]
                )
                var lengthText_1 = '水平距离：' + lineLength

                labelEntity_1 = mapTool.addLabel(centerPoint_1, lengthText_1)
                entityCollection1.push(labelEntity_1)

                // 计算中点
                var centerPoint_2 = Cesium.Cartesian3.midpoint(
                  positions[1],
                  positions[2],
                  new Cesium.Cartesian3()
                )
                // 计算距离
                heightLength = mapTool.getTwoPointsText(
                  positions[1],
                  positions[2]
                )
                var lengthText_2 = '高度差' + heightLength

                labelEntity_2 = mapTool.addLabel(centerPoint_2, lengthText_2)
                entityCollection1.push(labelEntity_2)

                // 计算中点
                var centerPoint_3 = Cesium.Cartesian3.midpoint(
                  positions[2],
                  positions[3],
                  new Cesium.Cartesian3()
                )
                // 计算距离
                hypotenuseLength = mapTool.getTwoPointsText(
                  positions[2],
                  positions[3]
                )
                var lengthText_3 = '空间距离：' + hypotenuseLength

                labelEntity_3 = mapTool.addLabel(centerPoint_3, lengthText_3)
                entityCollection1.push(labelEntity_3)
              } else {
                var verticalPoint = new Cesium.Cartesian3(
                  movePosition.x,
                  movePosition.y,
                  positions[0].z
                )
                positions.push(verticalPoint)
                positions.push(movePosition)
                positions.push(positions[0])
                // 绘制线
                mapTool.addLine(positions)
              }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
          } else {
            // 存储第二个点
            positions.pop()
            positions.pop()
            positions.pop()
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian)
            var height = Cesium.Cartographic.fromCartesian(positions[0]).height

            var verticalPoint = Cesium.Cartesian3.fromDegrees(
              Cesium.Math.toDegrees(cartographic.longitude),
              Cesium.Math.toDegrees(cartographic.latitude),
              height
            )

            // let vakk = parseFloat(lineLength) / parseFloat(hypotenuseLength);
            // let ang =
            //   (Math.asin(parseFloat(lineLength) / parseFloat(hypotenuseLength)) /
            //     Math.PI) *
            //   180; //

            if (cartographic.height < height) {
              let ang =
                (Math.asin(
                  parseFloat(lineLength) / parseFloat(hypotenuseLength)
                ) /
                  Math.PI) *
                180 //
              let midHeight = Cesium.Cartesian3.lerp(
                cartesian,
                verticalPoint,
                0.2,
                new Cesium.Cartesian3()
              )
              let midHypo = Cesium.Cartesian3.lerp(
                cartesian,
                positions[0],
                (parseFloat(heightLength) * 0.2) / parseFloat(hypotenuseLength),
                new Cesium.Cartesian3()
              )
              let angleLabel = Cesium.Cartesian3.midpoint(
                midHeight,
                midHypo,
                new Cesium.Cartesian3()
              )
              mapTool.addLabel(angleLabel, '角度为：' + ang.toFixed(1))
            } else {
              let ang =
                (Math.asin(
                  parseFloat(heightLength) / parseFloat(hypotenuseLength)
                ) /
                  Math.PI) *
                180 //
              let midHeight = Cesium.Cartesian3.lerp(
                positions[0],
                verticalPoint,
                0.2,
                new Cesium.Cartesian3()
              )
              let midHypo = Cesium.Cartesian3.lerp(
                positions[0],
                cartesian,
                (parseFloat(lineLength) * 0.2) / parseFloat(hypotenuseLength),
                new Cesium.Cartesian3()
              )
              let angleLabel = Cesium.Cartesian3.midpoint(
                midHeight,
                midHypo,
                new Cesium.Cartesian3()
              )
              mapTool.addLabel(angleLabel, '角度为：' + ang.toFixed(1))
            }
            positions.push(verticalPoint)
            positions.push(cartesian)
            positions.push(positions[0])
            mapTool.addPoint(cartesian)
            mapInit.handler.removeInputAction(
              Cesium.ScreenSpaceEventType.LEFT_CLICK
            )
            mapInit.handler.removeInputAction(
              Cesium.ScreenSpaceEventType.MOUSE_MOVE
            )

            app.measureList.filter((measureItem) => {
              measureItem.isFocus = false
            })
            mapInit.isMeasureHandler = false
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
      },
      //夹角测量
      Anglemeasurement: function (item) {
        let app = this
        let positions = []
        let savelabel = []
        var lineEntity = []
        let c1 = null
        let height = null
        let labelEntity = null // 标签实体
        let huxianEntity = []
        let flagHeight = null
        let line1 = null
        let line2 = null
        let line3 = null
        resetc1()
        mapInit.handler = new Cesium.ScreenSpaceEventHandler(
          window.viewer.scene.canvas
        )
        // 注册鼠标左击事件
        mapInit.handler.setInputAction((clickEvent) => {
          var cartesian = window.viewer.scene.pickPosition(clickEvent.position) // 坐标
          if (cartesian == undefined) {
            return false
          }
          // 存储第一个点

          if (positions.length == 0) {
            if (!cartesian) {
              return false
            }
            console.log(0, positions)

            positions.push(cartesian.clone())
            mapTool.addPoint(cartesian)

            // 注册鼠标移动事件
            mapInit.handler.setInputAction((moveEvent) => {
              var movePosition = window.viewer.scene.pickPosition(
                moveEvent.endPosition
              ) // 鼠标移动的点
              mapTool.addTips(movePosition, '单击绘制折线\n右键结束绘制')
              if (!movePosition) {
                return false
              }
              if (positions.length >= 2) {
                fuzhupoint(
                  movePosition,
                  false,
                  positions,
                  savelabel,
                  lineEntity
                )
              } else {
                var verticalPoint = new Cesium.Cartesian3(
                  movePosition.x,
                  movePosition.y,
                  positions[0].z
                )
                var verticalPoint11 = new Cesium.Cartesian3(
                  movePosition.x,
                  movePosition.y,
                  positions[0].z / 2
                )
                positions.push(verticalPoint)
                positions.push(verticalPoint11)
                positions.push(movePosition)
              }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
          } else {
            // 存储第二个点
            fuzhupoint(cartesian, true, positions, savelabel, lineEntity)
            mapTool.addPoint(cartesian)

            // 加入原点，开始第二条线
            positions.push(positions[0])
            positions.push(positions[0])
            positions.push(positions[0])
            positions.push(positions[0])
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        // 注册鼠标右击事件
        mapInit.handler.setInputAction(() => {
          positions.pop()
          positions.pop()
          positions.pop()
          angleLine(positions, lineEntity)
          endangleLine(positions, lineEntity)
          removeLabelEnt()
          mapInit.handler.destroy()
          mapInit.handler = null
          app.tips = window.viewer.entities.getById('tipEntity')
          if (app.tips != null) {
            window.viewer.entities.remove(app.tips)
          }
          app.measureList.filter((measureItem) => {
            measureItem.isFocus = false
          })
          mapInit.isMeasureHandler = false
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
        function fuzhupoint(
          movePosition,
          click,
          positions,
          savelabel,
          lineEntity
        ) {
          let drawpoint = null
          positions.pop()
          positions.pop()
          positions.pop()
          var cartographic11 = Cesium.Cartographic.fromCartesian(positions[0])
          var cartographic22 = Cesium.Cartographic.fromCartesian(movePosition)
          if (height == null) {
            height = Cesium.Cartographic.fromCartesian(positions[0]).height
            flagHeight = height
          }
          var height1 = Cesium.Cartographic.fromCartesian(movePosition).height
          //判断新增点与原点的高度
          if (height >= height1) {
            var verticalPoint11 = Cesium.Cartesian3.fromDegrees(
              Cesium.Math.toDegrees(cartographic11.longitude),
              Cesium.Math.toDegrees(cartographic11.latitude),
              height + 10
            )
            var verticalPoint22 = Cesium.Cartesian3.fromDegrees(
              Cesium.Math.toDegrees(cartographic22.longitude),
              Cesium.Math.toDegrees(cartographic22.latitude),
              height + 10
            )
            positions.push(verticalPoint11)
            positions.push(verticalPoint22)
            positions.push(movePosition)

            if (flagHeight != height) {
              changeheight(height)
              flagHeight = height
            }
          } else {
            var verticalPoint11 = Cesium.Cartesian3.fromDegrees(
              Cesium.Math.toDegrees(cartographic11.longitude),
              Cesium.Math.toDegrees(cartographic11.latitude),
              height1 + 10
            )
            var verticalPoint22 = Cesium.Cartesian3.fromDegrees(
              Cesium.Math.toDegrees(cartographic22.longitude),
              Cesium.Math.toDegrees(cartographic22.latitude),
              height1 + 10
            )
            positions.push(verticalPoint11)
            positions.push(verticalPoint22)
            positions.push(movePosition)
            if (flagHeight != height1) {
              changeheight(height1)
              flagHeight = height1
            }
          }

          // 修改原数组中高度值，确保夹角在同一高度
          function changeheight(height1) {
            for (let index = 0; index < positions.length; index++) {
              if (index % 4 == 1 || index % 4 == 2) {
                var cartographicindex = Cesium.Cartographic.fromCartesian(
                  positions[index]
                )
                var verticalPointindex = Cesium.Cartesian3.fromDegrees(
                  Cesium.Math.toDegrees(cartographicindex.longitude),
                  Cesium.Math.toDegrees(cartographicindex.latitude),
                  height1 + 10
                )

                positions[index] = verticalPointindex
              }
            }

            window.viewer.entities.remove(line1)
            window.viewer.entities.remove(line2)
            lineEntity.map((item) => {
              window.viewer.entities.remove(item)
            })

            if (savelabel.length > 0) {
              savelabel.map((item) => {
                var itemcar = Cesium.Cartographic.fromCartesian(
                  item.position._value
                )

                let posi = Cesium.Cartesian3.fromDegrees(
                  Cesium.Math.toDegrees(itemcar.longitude),
                  Cesium.Math.toDegrees(itemcar.latitude),
                  height1 + 10
                )
                item.position.setValue(posi)
              })
            }
            if (huxianEntity.length > 0) {
              huxianEntity.map((item) => {
                let newpoints = item[1].map((ele) => {
                  var itemcar = Cesium.Cartographic.fromCartesian(ele)
                  return Cesium.Cartesian3.fromDegrees(
                    Cesium.Math.toDegrees(itemcar.longitude),
                    Cesium.Math.toDegrees(itemcar.latitude),
                    height1 + 10
                  )
                })
                item[0].polyline.positions.setValue(newpoints)
              })
            }
          }

          let angel = null
          if (c1 != null) {
            var c2 = Cesium.Cartesian3.subtract(
              positions[positions.length - 2],
              positions[positions.length - 3],
              new Cesium.Cartesian3()
            )
            angel = mapTool.calcAngel(c1, c2) + ' 度'
          }

          if (click == true) {
            if (height < height1) {
              height = height1
              flagHeight = height
            }

            if (c1 == null) {
              c1 = Cesium.Cartesian3.subtract(
                positions[2],
                positions[1],
                new Cesium.Cartesian3()
              )
            } else {
              if (positions.length >= 6) {
                drawpoint = mapTool.getHarcPoints(
                  positions[1],
                  positions[2],
                  positions[positions.length - 2],
                  angel.slice(0, -1),
                  huxianEntity
                )
                labelEntity.position.setValue(
                  drawpoint[150],
                  drawpoint[151],
                  drawpoint[152]
                )
                labelEntity = mapTool.addLabel(drawpoint[50], angel)

                savelabel.push(labelEntity)
                labelEntity = mapTool.addLabel(
                  positions[positions.length - 2],
                  angel
                )
              }
            }
            if (positions.length < 6) {
              labelEntity = mapTool.addLabel(
                positions[positions.length - 2],
                angel
              )
            }
          } else {
            if (labelEntity) {
              labelEntity.label.text.setValue(angel)
              labelEntity.position.setValue(positions[positions.length - 2])
            }
          }
          angleLine(positions, lineEntity)
        }
        function resetc1() {
          c1 = null
          labelEntity = null
          height = null
          huxianEntity = []
        }
        function angleLine(positions, lineEntity) {
          const viewer = window.viewer

          if (line1 != null) {
            viewer.entities.remove(line1)
            viewer.entities.remove(line2)
            viewer.entities.remove(line3)
            line1 = null
            line2 = null
            line3 = null
          }

          //将原数组分为三类，保证画出不同颜色并实时更新的线
          let pointstype = []
          let points = []
          let pointsline = []
          for (let index = 0; index < positions.length; index++) {
            if (index == 0) {
              pointstype.push(positions[index])
              pointstype.push(positions[index + 1])
            } else if (index % 4 == 1) {
              points.push(positions[1])
              points.push(positions[index + 1])
            } else if (index % 4 == 2) {
              pointsline.push([positions[index], positions[index + 1]])
              // pointsline.push(positions[index]);
              // pointsline.push(positions[index+1]);
            }
          }

          line1 = viewer.entities.add(
            new Cesium.Entity({
              polyline: {
                positions: new Cesium.CallbackProperty(() => {
                  return pointstype
                }, false),
                width: 2,
                material: new Cesium.PolylineDashMaterialProperty({
                  color: Cesium.Color.AQUA,
                }),
              },
            })
          )
          line2 = viewer.entities.add(
            new Cesium.Entity({
              polyline: {
                positions: new Cesium.CallbackProperty(() => {
                  return points
                }, false),
                width: 2,
                material: Cesium.Color.YELLOW,
              },
            })
          )

          pointsline.map((item) => {
            line3 = viewer.entities.add(
              new Cesium.Entity({
                polyline: {
                  positions: new Cesium.CallbackProperty(() => {
                    // return item;
                    return item
                  }, false),
                  width: 2,
                  material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.AQUA,
                  }),
                },
              })
            )
            lineEntity.push(line3)
          })
        }
        function endangleLine(positions, lineEntity) {
          const viewer = window.viewer
          //将原数组分为三类，保证画出不同颜色并实时更新的线
          let pointstype = []
          let points = []
          let pointsline = []
          for (let index = 0; index < positions.length; index++) {
            if (index == 0) {
              pointstype.push(positions[index])
              pointstype.push(positions[index + 1])
            } else if (index % 4 == 1) {
              points.push(positions[1])
              points.push(positions[index + 1])
            } else if (index % 4 == 2) {
              pointsline.push([positions[index], positions[index + 1]])
              // pointsline.push(positions[index]);
              // pointsline.push(positions[index+1]);
            }
          }
          viewer.entities.add(
            new Cesium.Entity({
              polyline: {
                positions: pointstype,
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
                positions: points,
                width: 2,
                material: Cesium.Color.YELLOW,
              },
            })
          )

          pointsline.map((item) => {
            viewer.entities.add(
              new Cesium.Entity({
                polyline: {
                  positions: item,
                  width: 2,
                  material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.AQUA,
                  }),
                },
              })
            )
          })
        }
        // 移除最后一个label
        function removeLabelEnt() {
          window.viewer.entities.remove(labelEntity)
        }
      },
      // 关闭量算事件
      closeMeasureEvent: function () {
        this.positions.pop()
        if (mapInit.handler) {
          mapInit.handler.destroy()
        }
        mapInit.handler = null
      },
    },
  }
</script>
<style lang="scss">
  @import './tool.scss';
</style>
