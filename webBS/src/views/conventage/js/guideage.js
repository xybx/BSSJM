import conventlog from "@/views/conventage/components/conventlog.vue";
import {delGuide, getGuideList} from "@/views/conventage/api/conventage";

export default {
  name: "guideage",
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
    }
  },
  components: {
    conventlog
  },
  computed:{

  },
  created() {
    this.pageSize = this.pageSizes[0]
  },
  mounted(){
    this.getTableFields()
  },
  methods:{
    addguide(){
      this.$refs.convent.showGuide(null,1)
    },
    lookClick(pid){
      this.$refs.convent.showGuide(pid,3)
    },
    editClick(pid){
      this.$refs.convent.showGuide(pid,2)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？', '删除提示',async ()=>{
        let res = await delGuide({pid:pid})
        if(res.code == 200){
          this.$message.success('已删除')
          this.getListData()
        }
      })
    },
    getTableFields(){
      this.tableColumns = [
        {prop: 'guidname', label: '名称'},
        {prop: 'creatdate', label: '创建时间'},
        {prop: 'editdate', label: '修改时间'},
      ]
      this.getListData()
    },
    async getListData(){
      let data = {pagenumber:this.pageNo, pagesize:this.pageSize}
      let res = await getGuideList(data)
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
