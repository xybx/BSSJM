import {getbehandleList, getTaskList} from '../api/taskwork'
import queryForm from "../components/queryForm.vue";
import taskDialog from "../components/taskDialog.vue";
import overdialog from "../components/overdialog.vue";
export default {
  name: "taskover",
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
  components:{
    taskDialog,
    queryForm,
    overdialog

  },
  computed:{

  },
  created() {
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
        {prop: 'type', label:'办理状态'},
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
      let res = this.tabCard == 'over' ?  await getbehandleList(data) : await getTaskList(data)
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
    transfer(pid){
      this.$refs.overlog.showData(pid,1)
    },
    handle(pid){
      this.$refs.overlog.showData(pid,2)
    },
    cancel(pid){
      this.$refs.overlog.showData(pid,3)
    },
    Look(pid){
      this.$refs.tasklog.showEdit(pid)
    },
  }
}
