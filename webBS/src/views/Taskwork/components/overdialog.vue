<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="taskData" :model="taskData" :rules="tRules" status-icon label-width="100px">
      <template v-if="verify">
        <el-form-item label="打回意见" prop="reoption">
          <el-input v-model="taskData.reoption" type="textarea" :rows="5" placeholder="请输入打回意见" />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item v-if="keys == 1" label="请选择" prop="uid">
          <el-select v-model="taskData.uid" filterable placeholder="请选择" @change="transChange">
            <el-option v-for="item in userData" :key="item.pid" :value="item.pid" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else :label="this.keys == 2 ? '办理意见' : '忽略意见'" prop="opinion">
          <el-input v-model="taskData.opinion" type="textarea" :rows="5" :placeholder="this.keys == 2 ? '请输入办理意见' : '请输入忽略意见'" />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="verify" type="primary" size="medium" @click="saveVerify">确 定</el-button>
      <el-button v-else type="primary" size="medium" @click="saveData">确 定</el-button>
      <el-button size="medium" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {getUserList, putHandle, putReject, putTransfer, putVerify} from "@/views/Taskwork/api/taskwork";
export default {
  name: "overdialog",
  props:['verify'],
  data(){
    return {
      dialogVisible:false,
      title: "",
      taskData:{},
      userData:[],
      tRules:{
        uid:[{required: true, trigger: "change", message: "请选择"}],
        opinion:[{required: true, trigger: "blur", message: "请填写意见"}],
        reoption:[{required: true, trigger: "blur", message: "请填写意见"}],
      },
      keys:null,
      pids:null
    }
  },
  components:{

  },
  computed:{

  },
  created() {
  },
  mounted() {
  },
  methods:{
    showExamine(pid){
      this.title = '打回办理'
      this.pids = pid
      this.dialogVisible = true
    },
    async showData(pid,index){
      this.keys = index
      this.title = index == 1 ? '转办办理' : index == 2 ? '事项办理' : '忽略办理'
      if(index == 1){
        this.getTanUser()
      }
      this.pids = pid
      this.dialogVisible = true
    },
    async getTanUser(){
      let res = await getUserList()
      this.userData = res.data.length > 0 ? res.data : []
    },
    transChange(val){
      this.taskData.uid = val
    },
    saveData(){
      this.$refs.taskData.validate(async (valid)=>{
        if(valid){
          let data = {}
          if(this.keys == 1){
            Object.assign(data,{pid:this.pids,uid:this.taskData.uid})
          }else {
            Object.assign(data,{matterid:this.pids,opinion:this.taskData.opinion})
          }
          let res = this.keys == 1 ?  await putTransfer(data) : this.keys == 2 ? await putHandle(data) : await putReject(data)
          if(res.code == 200){
            this.$message.success('办理成功')
            this.handleClose()
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    saveVerify(){
      this.$refs.taskData.validate(async (valid)=>{
        if(valid){
          let data = {}
          Object.assign(data,{matterid:this.pids,appmark:2,opinion:this.taskData.reoption})
          let res = await putVerify(data)
          if(res.code == 200){
            this.$message.success('办理成功')
            this.handleClose()
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    handleClose(){
      this.keys = null
      this.title = ''
      this.pids = null
      this.$refs.taskData.resetFields()
      this.taskData = this.$options.data().taskData
      this.dialogVisible = false
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
      ::v-deep{
        .el-input--small .el-input__inner{
          height: 38px;
          line-height: 38px;
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
