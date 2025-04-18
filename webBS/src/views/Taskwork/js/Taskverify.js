import queryForm from "@/views/Taskwork/components/queryForm.vue";
import taskDialog from "@/views/Taskwork/components/taskDialog.vue";
import overdialog from "@/views/Taskwork/components/overdialog.vue";
import {getVoverList, getVendList, putVerify} from "@/views/Taskwork/api/taskwork";
import {delPhone} from "@/views/conventage/api/conventage";
export default {
  name: "taskverify",
  data(){
    return {
      tabCard:'over',
      tableColumns:[],
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
    }
  },
  components: {overdialog, taskDialog, queryForm},
  computed:{

  },

  created(){
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getTableFields()
    this.getData()
  },
  methods:{
    tabChange(val){
      this.tabCard = val
      this.getData()
    },
    getTableFields(){
      this.tableColumns = [
        {prop: 'areaname', label: '归属辖区(派出所)'},
        {prop: 'typename', label: '事项类别'},
        {prop: 'startdate', label: '上报时间'},
        {prop: 'uptype', label: '实名/匿名'},
        {prop: 'username', label: '姓名'},
        {prop: 'pphone', label: '手机号'},
        {prop: 'apprank', label:'审核状态'},
      ]
    },
    async getData(){
      let data = {pagenumber:this.pageNo,pagesize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = this.tabCard == 'over' ?  await getVoverList(data) : await getVendList(data)
      if(res.code == 200){
        this.tableData = res.data.list
        this.total = res.data.total
      }else {
        this.tableData = []
        this.total = 0
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    passClick(pid){
      this.$baseConfirm('你确定要通过吗？', '通过提示',async ()=>{
        let res = await putVerify({matterid:pid,appmark:1})
        if(res.code == 200){
          this.$message.success('已通过')
          this.getData()
        }
      })
    },
    repulse(pid){
      this.$refs.overlog.showExamine(pid)
    },
    Look(pid){
      this.$refs.tasklog.showEdit(pid)
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    SizeChange(val){
      this.pageSize = val;
      this.getData();
    },
    CurrentChange(val){
      this.pageNo = val;
      this.getData();
    },
  }
}
