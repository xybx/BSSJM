<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="38%" top="2%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="formData" :model="formData" status-icon label-width="100px">
      <el-form-item label="姓名">
        <el-input v-model="formData.username" readonly placeholder="姓名"/>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formData.phonenum" readonly placeholder="手机号"/>
      </el-form-item>
      <el-form-item label="单位">
        <el-input v-model="formData.areaname" readonly placeholder="单位"/>
      </el-form-item>
      <el-form-item label="打卡类型">
        <el-select v-model="formData.typeid">
            <el-option v-for="(item,index) in cateData" :key="index" :value="item.pid" :label="item.typename"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="打卡时间">
        <el-date-picker type="datetime" v-model="formData.signtime" readonly placeholder="打卡时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="打卡内容">
        <el-input type="textarea" v-model="formData.content" readonly :rows="5" placeholder="打卡内容" />
      </el-form-item>
      <el-form-item label="打卡图片">
        <el-image fit="fill" :src="formData.srcList"></el-image>
      </el-form-item>
      <el-form-item label="打卡定位">
        <el-input v-model="formData.signaddress" readonly placeholder="打卡定位"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {getSignCategory} from "@/views/Records/api/record";

export default {
  name: "recordLog",
  data(){
    return {
      dialogVisible:false,
      title:'',
      formData:{},
      cateData:[],
    }
  },
  created(){

  },
  mounted(){

  },
  methods:{
    async getCateData(){
      let res = await getSignCategory()
      if(res.code == 200){
        this.cateData = res.data.length > 0 ? res.data : []
      }
    },
    async showEdit(obj){
      this.title = '查看打卡详情'
      this.formData = obj
      this.formData.srcList = `${window.apiURL}/gridfs/artworkmaster/${obj.signimage}`
      this.getCateData()
      this.dialogVisible = true
    },
    handleClose(){
      this.title = ''
      this.formData = this.$options.data().formData
      this.dialogVisible = false
    },
  }
}
</script>
<style scoped lang="scss">
.el-dialog__body{
  .el-form{
    .el-form-item{
      .el-input, .el-select,.el-textarea,.el-cascader{
        width: 100%;
      }
      ::v-deep{
        .el-input--small .el-input__inner{
          height:35px;
          line-height: 35px;
        }
        .el-image{
          width: 150px;
          height: 150px;
          float:left;
          border-radius: 5px;
          box-shadow: 0 1px 3px 1px rgba(0,0,0,.1);
          margin-right: 10px;
          margin-bottom: 10px;
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
