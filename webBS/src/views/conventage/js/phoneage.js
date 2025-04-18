import {delPhone, getPhoneList} from "@/views/conventage/api/conventage";
import conventlog from '../components/conventlog.vue'
export default {
  name: "phoneage",
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
  components:{
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
    addphone(){
      this.$refs.convent.showPhone(null)
    },
    editClick(pid){
      this.$refs.convent.showPhone(pid)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？', '删除提示',async ()=>{
        let res = await delPhone({pid:pid})
        if(res.code == 200){
          this.$message.success('已删除')
          this.getListData()
        }
      })
    },
    getTableFields(){
      this.tableColumns = [
        {prop: 'desname', label: '名称'},
        {prop: 'phone', label: '联系电话'},
      ]
      this.getListData()
    },
    async getListData(){
      let data = {pagenumber:this.pageNo, pagesize:this.pageSize}
      let res = await getPhoneList(data)
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

  },
}
