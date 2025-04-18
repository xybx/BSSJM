<template>
  <div>
    <slide-verify ref="slideblock" :class="pass ? 'noicon' : ''" :imgs='slideImgs' @again="onAgain" @fulfilled="onFulfilled" @success="onSuccess" @fail="onFail" @refresh="onRefresh" :slider-text="text" :accuracy="accuracy"></slide-verify>
  </div>
</template>

<script>
export default {
  name: "SlideVerifys",
  data() {
    return {
      text: '向右拖动滑块完成拼图>>',
      //精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
      accuracy:null,
      pass:false,
      slideImgs:[]
    }
  },
  components: {},
  computed: {},
  created() {
    this.accuracy = this.$accuracy
    this.getimgs()
  },
  mounted() {
  },
  methods: {
    getimgs(){
      let arr = ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.jpg','12.jpg','13.jpg','14.jpg','15.jpg','16.jpg','17.jpg','18.jpg','19.jpg','20.jpg']
      this.slideImgs = arr.map(item=>{
        return require(`@/assets/code/${item}`)
      })
    },
    onSuccess(times){
      this.pass = true
      this.$emit('passClick',true,times)
    },
    onFail(){
      this.pass = false
      this.$emit('passClick',false,'验证不通过，请重新验证')
    },
    onRefresh(){
      this.pass = false
    },
    onFulfilled() {
      this.pass = false
    },
    onAgain() {
      this.pass = false
      this.$emit('passClick',false,'请在重试一次')
      // this.$refs.slideblock.reset();
    },
    handleClick() {
      this.pass = false
      this.$emit('passClick',false,'')
      this.$refs.slideblock.reset();
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep{
  .slide-verify{
    //width: 100%!important;
    canvas{
      //width: 100%;
      //height: 160px;
    }
    .slide-verify-block{
      //width:69px;
    }
    .slide-verify-slider{
      margin-top: 0;
      .slide-verify-slider-text{
        color: #888;
      }
    }
    &.noicon{
      .slide-verify-refresh-icon{
        display: none;
      }
    }
  }
  .font{
    color: #0aa908;
    i{
      font-size: 16px;
      margin-right: 5px;
    }
  }
}
</style>
