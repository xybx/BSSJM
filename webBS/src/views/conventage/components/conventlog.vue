<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="8%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="convetData" :model="convetData" :rules="convetRules" status-icon label-width="100px">
        <template v-if="isphone">
          <el-form-item label="名称" prop="desname">
            <el-input v-model="convetData.desname" placeholder="请输入名称"/>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="convetData.phone" maxlength="11" placeholder="请输入联系电话"/>
          </el-form-item>
          <el-form-item label="排序" prop="serial">
            <el-input-number v-model="convetData.serial" :min="1" placeholder="请输入排序"/>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="名称" prop="guidname">
            <el-input v-model="convetData.guidname" placeholder="请输入名称"/>
          </el-form-item>
          <el-form-item label="序号" prop="serial">
            <el-input v-model="convetData.serial" placeholder="请输入序号"/>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <quill-editor v-model="convetData.content" ref="myQuillEditor" class="editor" :options="editorOption"></quill-editor>
          </el-form-item>
        </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys!== 3" type="primary" size="medium" @click="saveData">确 定</el-button>
      <el-button size="medium" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getGuideInfo, getPhoneInfo, putGuide, putPhone} from "@/views/conventage/api/conventage";
import {mapGetters} from 'vuex'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor,Quill } from 'vue-quill-editor'
import {ImageExtend, QuillWatch} from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  name: "conventlog",
  data(){
    return {
      dialogVisible:false,
      title: "",
      convetData:{},
      convetRules:{
        desname:[{required: true, trigger: "blur", message: "请输入名称"}],
        phone:[{required: true, trigger: "blur", message: "请输入联系电话"}],
        serial:[{required: true, trigger: "blur", message: "请输入排序"}],
        guidname:[{required: true, trigger: "blur", message: "请输入名称"}],
        content:[{required: true, trigger: "blur", message: "请输入内容"}]
      },
      keys:null,
      editorOption: {
        theme: "snow",
        bounds: document.body,
        placeholder: "请输入内容",
        debug: 'warn',
        readOnly:false,
        modules: {
          clipboard: {
            // 粘贴版，处理粘贴时候带图片
            // matchers: [[Node.ELEMENT_NODE, this.handleCustomMatcher]],
            matchers: [['img', this.handleCustomMatcher]],
          },
          ImageExtend: {
            loading: true,
            name: 'files',
            action: `${this.$baseUrl}/gridfs/richtextimgupload`,
            headers: {
              'Authorization':this.token
            },
            response: (res) => {
              if(res.code == 200){
                return `${this.$baseUrl}/gridfs/image/${res.data[0]}`
              }else {
                this.$message.error('图片你上传失败')
              }
            }
          },
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
              ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
              [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
              [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
              [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
              [{ indent: "-1" }, { indent: "+1" }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
              [{ direction: "rtl" }], // 文本方向-----[{'direction': 'rtl'}]
              [{ size: ["small", false, "large", "huge"] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
              [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
              [{ font: [] }], // 字体种类-----[{ font: [] }]
              [{ align: [] }], // 对齐方式-----[{ align: [] }]
              ["clean"], // 清除文本格式-----['clean']
              ["link","image"] // 链接、图片、视频-----['link', 'image', 'video']
            ],
            handlers:{
              image:()=>{
                QuillWatch.emit(this.$refs.myQuillEditor.quill.id)
              }
            }
          }
        }
      },
    }
  },
  props:['isphone'],
  components:{
    quillEditor,
  },
  computed:{
     ...mapGetters({
      token:'user/token'
    }),
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  created() {
  },
  mounted() {
  },
  methods:{
    showPhone(pid){
      this.title = !pid ? '添加便民电话' : '编辑便民电话'
      if(pid){
        this.getInfo(pid)
      }
      this.dialogVisible = true
    },
    showGuide(pid,index){
      this.keys = index
      this.title = index == 1 ? '添加办事指南' : index == 2 ? '编辑办事指南' : '查看办事指南'
      if(pid){
        this.getInfo(pid)
      }
      this.dialogVisible = true
    },
    async getInfo(pid){
      let res = this.isphone ? await getPhoneInfo({pid:pid}) : await getGuideInfo({pid:pid})
      this.convetData = res.data ? res.data : {}
    },
    saveData(){
      this.$refs.convetData.validate(async (valid)=>{
        if(valid){
          let data = this.isphone ? Object.assign({},this.convetData) : Object.assign({},this.convetData)
           const loading = this.$loading({
            lock: true,
            text: '提交中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let res = this.isphone ? await putPhone(data) : await putGuide(data)
          if(res.code === 200){
            loading.close();
            this.$message.success('提交成功')
            this.handleClose()
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    handleClose(){
      this.title = ''
      this.keys = null
      this.$refs.convetData.resetFields()
      this.convetData = this.$options.data().convetData
      this.dialogVisible = false
    },
    handleCustomMatcher(node, Delta) {
      let ops = []
      Delta.ops.forEach(op => {
        // 如果粘贴了图片，这里会是一个对象，所以可以这样处理
        console.log(op)
        if (op.insert && (op.insert.image.indexOf('jwb.dpinfo.com.cn:9100') > -1 || typeof op.insert.image == 'string')) {
          ops.push({
            insert: op.insert,
          })
        }else{
          setTimeout(()=>{
            this.$message.error('不允许粘贴图片,请手动上传')
            return false
          },500)
        }
      })
      Delta.ops = ops
      return Delta
    },
  }
}
</script>
<style scoped lang="scss">
.el-dialog__body{
  .el-form{
    .el-form-item{
      .el-input, .el-select,.el-textarea ,.el-cascader,.el-input-number{
        width: 100%;
      }
      ::v-deep{
        .el-input--small .el-input__inner{
          //height: 38px;
          //line-height: 38px;
        }
        .el-input-number__decrease,.el-input-number__increase{
          //top: 1px;
          //line-height:37px;
        }
        .editor {
          line-height: normal !important;
          .ql-container{
            height: 320px;
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
