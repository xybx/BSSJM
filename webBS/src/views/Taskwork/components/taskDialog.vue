<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="38%" top="4%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="medium">
       <el-radio-button label="baseinfo">基本信息</el-radio-button>
       <el-radio-button label="flowover">办理流程</el-radio-button>
    </el-radio-group>
    <el-form v-if="tabCard === 'baseinfo'" ref="formData" :model="formData" status-icon label-width="120px">
      <el-form-item label="事项类别">
        <el-input v-model="formData.typename" readonly placeholder="请选择事项类别"/>
      </el-form-item>
      <el-form-item label="是否匿名">
        <el-select v-model="formData.uptype" placeholder="请选择核验结果" disabled clearable>
          <el-option :value="0" label="实名"></el-option>
          <el-option :value="1" label="匿名"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formData.username" readonly placeholder="请输入姓名"/>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formData.pphone" readonly placeholder="请输入单位"/>
      </el-form-item>
      <el-form-item label="所属派出所">
        <el-input v-model="formData.selareaname" readonly placeholder="请输入所属派出所"/>
      </el-form-item>
<!--      <el-form-item label="上报位置">-->
<!--        <el-input v-model="formData.areaname" readonly placeholder="请输入上报位置"/>-->
<!--      </el-form-item>-->
      <el-form-item label="事件内容">
          <el-input v-model="formData.repconten" readonly type="textarea" :rows="5" placeholder="请输入事件内容" disabled />
      </el-form-item>
      <el-form-item label="审核意见内容">
          <el-input v-model="formData.appcontent" readonly type="textarea" :rows="5" placeholder="请输入审核意见内容" disabled />
      </el-form-item>
      <el-form-item label="上报时间">
        <el-date-picker v-model="formData.startdate" readonly type="date" value-format="yyyy-MM-dd" placeholder="请选择上报时间" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="上报位置">
         <el-input v-model="formData.address" readonly placeholder="请输入上传地址" disabled />
      </el-form-item>
      <el-form-item label="图片展示">
          <div v-if="!imgdata.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <template v-else>
            <div v-for="item in imgdata">
              <el-image :src="item" :preview-src-list="imgdata" :z-index="2999"></el-image>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="驳回意见" v-if="formData.rejection">
          <el-input v-model="formData.rejection" type="textarea" :rows="5" placeholder="请输入驳回意见" disabled />
        </el-form-item>
        <el-form-item label="回复意见" v-if="formData.admincontent">
          <el-input v-model="formData.admincontent" type="textarea" :rows="5" placeholder="请输入意见回复" disabled />
        </el-form-item>
        <el-form-item label="回复图片" v-if="formData.adminimages && formData.adminimages.length">
          <div v-if="!urldata.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <template v-else>
            <div v-for="item in urldata">
              <el-image :src="item" :preview-src-list="urldata" :z-index="2999"/>
            </div>
          </template>
        </el-form-item>
<!--        <el-form-item label="音频文件">-->
<!--          <aplayer :music="music" :list="audioList" :show-lrc="true" />-->
<!--        </el-form-item>-->
        <el-form-item label="视频文件">
          <video-player ref="videoPlayer" :playsinline="true" :options="playerOptions" />
        </el-form-item>
<!--        <el-form-item label="评价时间" v-if="formData.appdate">-->
<!--          <el-date-picker v-model="formData.appdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择评价时间" disabled />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="评价等级" v-if="formData.apprank">-->
<!--          <el-select v-model="formData.apprank" placeholder="请选择评价等级" disabled>-->
<!--            <el-option :value="0" label="非常满意"></el-option>-->
<!--            <el-option :value="1" label="满意"></el-option>-->
<!--            <el-option :value="2" label="不满意"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
    </el-form>
    <div v-if="tabCard === 'flowover'">
       <el-timeline>
         <el-timeline-item v-for="(item,index) in flowData" :key="index" placement="top" :timestamp="item.date ? item.date : ''">
           <div class="timehead">
             <span>{{ item.username }}</span>
             <i class="blue">{{item.stagename}}</i>
           </div>
           <div class='timebody'>
             <span>{{ item.opinion ? item.opinion:'暂无办理意见'}}</span>
           </div>
<!--           <div class="timefoot">-->
<!--             <span class="nextman" v-if="item.nextstatename != ''"><label>下阶段办理状态：</label><i class="org">{{item.nextstatename}}</i></span>-->
<!--             <span class="nextman" v-if="item.nextusername != ''"><label>办理人:</label>{{item.nextusername}}</span>-->
<!--           </div>-->
         </el-timeline-item>
         <span class="notime" v-if="flowData.length === 0">暂无流程</span>
       </el-timeline>
    </div>
    <span slot="footer" class="dialog-footer">
      <!--<el-button type="primary" size="medium" @click="saveData">保 存</el-button>-->
      <el-button size="medium" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {getTaskIdea, getTaskTail} from "../api/taskwork";
import {videoPlayer} from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import aplayer from 'vue-aplayer'
import {mapGetters} from "vuex";
export default {
  name: "taskDialog",
  data(){
    return {
      formData:{},
      dialogVisible:false,
      title: "",
      tabCard: "baseinfo",
      flowData:[],
      imgdata:[],
      urldata:[],
      audioList:[],
      music:{src:'',title:''},
      playerOptions:{
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "video/mp4", // 类型
          src: '' // url地址
        }],
        poster: '', // 封面地址
        notSupportedMessage: '用户未上传视频', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
      },
    }
  },
  components:{
    videoPlayer,
    aplayer
  },
  computed:{
    player() {
      return this.$refs.videoPlayer.player
    },
    ...mapGetters({
      token:'user/token'
    })
  },
  create(){

  },
  methods:{
    async showEdit(pid){
      this.title = '查看详情';
      let res = await getTaskTail({pid:pid})
      if(res.code == 200){
        // let Base64 = require('js-base64').Base64
        // let content = Base64.decode(res.data.repconten)
        this.formData = res.data
        // this.$nextTick(()=>{
        //   this.formData.repconten = content
        // })
        if(res.data.arepimage && res.data.arepimage.length){
            this.imgdata = res.data.arepimage.split(',').map(item=>{
               return `${this.$baseUrl}/gridfs/image/${item}?token=${this.token}`
            })
          }else {
            this.imgdata = []
          }
          if(res.data.adminimages && res.data.adminimages.length){
              this.urldata = res.data.adminimages.split(',').map(item=>{
                return `${this.$baseUrl}/gridfs/image/${item.fileid}`
              })
          }else{
            this.urldata = []
          }
          // if(res.data.arepyuyin && res.data.arepyuyin != ''){
          //   this.audioList = res.data.arepyuyin.split(',').map(item=>{
          //     return {
          //       title:'未知',
          //       src:`${this.$baseUrl}/gridfs/downloadFile/${item}?token=${this.token}`
          //     }
          //   })
          //   this.music = this.audioList[0]
          // }else {
          //   this.audioList = []
          //   this.music = {src:'',title:''}
          // }
          if(res.data.arepvideo && res.data.arepvideo != ''){
            this.$nextTick(()=>{
              this.playerOptions.sources[0].src = `${this.$baseUrl}/gridfs/downloadFile/${res.data.arepvideo}?token=${this.token}`
            })
          }else {
            this.$nextTick(()=>{
              this.playerOptions.sources[0].src = ''
            })
          }
      }else {
         this.$message.warning('没有此条数据！')
         return false
      }
      this.getIdea(pid)
      this.dialogVisible = true
    },
    async getIdea(pid){
      let res = await getTaskIdea({pid:pid})
      this.flowData = res.data.length > 0 ? res.data : []
    },
    tabChange(val){
      this.tabCard = val;
    },
    handleClose(){
      this.dialogVisible = false;
      this.title = ''
      this.formData = this.$options.data().formData;
      this.tabCard = 'baseinfo'
    },
  }
}
</script>
<style scoped lang="scss">
.el-dialog__body{
  .radiogroup {
    display: block;
    text-align: center;
    margin-bottom: 15px;
  }
  .el-form{
    .el-form-item{
      .el-input, .el-select,.el-textarea ,.el-cascader{
        width: 100%;
      }
      .video-player{
        width:420px;
      }
      .aplayer{
        width:420px;
      }
      ::v-deep{
        .el-input--small .el-input__inner{
          height: 38px;
          line-height: 38px;
        }
        .imagebox{
          width: 150px;
          height: 150px;
          background-color: #f3f3f3;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border-radius: 5px;
          i{
            font-size: 30px;
            color: #999;
          }
          u{
            text-decoration: none;
            font-size: 15px;
            color: #999;
          }
        }
        .el-image{
          width: 150px;
          height: 150px;
          float: left;
          border-radius: 5px;
          box-shadow: 0 1px 3px 1px rgba(0,0,0,.1);
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .el-timeline{
     margin-top:30px;
    .notime{
      display: block;
      font-size: 16px;
      color: #999;
      padding: 20px;
    }
     ::v-deep{
      .el-timeline-item__tail{
        border-color: #ceedea;
      }
      .el-timeline-item__node{
        background-color: #3068f5;
      }
       .el-timeline-item__timestamp.is-top{
          display: inline-block;
          height: 24px;
       }
    }
      .el-timeline-item{
        .el-timeline-item__tail{
          top: 5px;
        }
        .el-timeline-item__node--normal{
          top: 6px;
          background-color:#1990ff;
        }
        .el-timeline-item__wrapper{
          top: 2px;
          .el-timeline-item__content{
            .timehead{
              position: absolute;
              top: 2px;
              left: 170px;
              span{
                font-size: 16px;
                color: #333;
              }
              i{
                margin-left: 20px;
                font-size: 15px;
                border:1px solid;
                border-radius: 25px;
                padding:2px 12px;
                color:#FD7837;
                font-style: inherit;
                &.blue{
                  color:#2E8CFF;
                  border-color: #2E8CFF;
                }
                &.org{
                  color:#FD7837;
                  border-color: #FD7837;
                }
                &.grey{
                  color: #999999;
                  border-color: #999;
                }
              }
            }
            .timebody{
              min-height:80px;
              background-color:#EBEEF5;
              padding: 10px 15px;
              margin-top: 5px;
              border-radius:5px;
              span{
                color: #666;
                font-size: 15px;
                display: block;
                margin-bottom: 12px;
              }
            }
            .timefoot{
              display: flex;
              flex-direction:row;
              align-items:center;
              .nextman{
                width:100%;
                margin-top:15px;
                color: #666;
                display: block;
                label{
                  font-weight: bold;
                  color: #333;
                  margin-right: 10px;
                }
                i{
                  font-size: 15px;
                  border:1px solid;
                  border-radius: 25px;
                  padding:2px 12px;
                  color:#FD7837;
                  font-style: inherit;
                  &.org{
                    color:#FD7837;
                    border-color: #FD7837;
                  }
                }
              }
            }

          }
        }
      }
   }
}
.el-dialog__footer{
  .el-button{
    padding:11px 25px;
    font-size: 15px;
  }
}
</style>
