import {mapGetters,mapMutations} from 'vuex'
import vabHeader from '@/vab/components/VabHeader/index.vue';
export default {
  name: "Home",
  data(){
    return {
      pages: true,
      noback:true,
      moduleData:[],
      titleName:'博山区山警码上办平台'
    }
  },
  components:{
    vabHeader
  },
  computed:{
    ...mapGetters({
      userData: 'user/userData',
      routers: 'routes/routes',
    }),
  },
  created(){

  },
  mounted(){
    this.getMoudle()
  },
  methods:{
     ...mapMutations({
      setCollapse:'settings/setCollapse'
    }),
      getMoudle(){
        this.moduleData = [
          {name1:'三维',name2:'可视化',rindex:1,class:'animate__fadeInLeft',icon:'icon-zukuneiqiantubiao'},
          {name:'码上警务事项管理',rindex:2,class:'animate__fadeInRight',icon:'icon-jianduguanli'},
        ]
      },
      menuClick(key){
        localStorage.setItem('showMenuIndex', key)
        // if(key == 2) this.setCollapse(true)
        // else this.setCollapse(false)
        let arr = this.routers.filter(item => {
          return item.showMenuIndex === key
        })
        if (arr.length > 0) {
          let url = arr[0].path
          this.$router.push({path: url})
        } else {
          this.$baseConfirm('你暂无权限查看此栏目，请联系管理员！', '信息提示', () => {
            return false
          })
        }
      },
  }
}

