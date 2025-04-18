import queryForm from "../components/queryForm.vue";
import {getTaskList} from "../api/taskwork";
import taskDialog from "../components/taskDialog.vue";
export default {
  name: "taskwork",
  data(){
    return {
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
  components:{
    queryForm,
    taskDialog
  },
  computed:{

  },
  created(){
    this.pageSize = this.pageSizes[0]
  },
  mounted(){
    this.$forceUpdate()
    this.getTableFields()
    this.getListData()
  },
  methods:{
    getTableFields(){
      this.tableColumns = [
        {prop: 'areaname', label: '归属辖区(派出所)'},
        {prop: 'typename', label: '事项类别'},
        {prop: 'startdate', label: '上报时间'},
        {prop: 'uptype', label: '实名/匿名'},
        {prop: 'username', label: '姓名'},
        {prop: 'pphone', label: '手机号'},
        {prop:'type',label: '处理状态'},
        {prop: 'apprank', label:'审核状态'},
      ]
    },
    async getListData(){
      let params = {pagenumber:this.pageNo, pagesize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(params,obj)
        }
      }
      let res= await getTaskList(params)
      if(res.code === 200){
        this.tableData = res.data.list
        this.total = res.data.total
      }else{
        this.tableData = []
      }
      setTimeout(() => {
        this.tabloading = false;
      }, 200)
    },
    Look(pid){
      this.$refs.tasklog.showEdit(pid)
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getListData()
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    CurrentChange(val) {
      this.pageNo = val;
      this.getListData();
    },
  }
}
