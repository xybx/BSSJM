<template>
  <div class="login-container animate__animated animate__backInLeft animate__delay-1s">
    <el-row class="login_bg">
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <div class="top">
          <h3 class="animate__animated animate__backInDown animate__delay-2s" title="博山区山警码上办平台">博山区山警码上办平台</h3>
        </div>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="login-form animate__animated animate__flipInY animate__delay-2s"
          label-position="left">

          <div class="title-tips">
            {{ translateTitle('登录') }}
          </div>
          <el-form-item prop="username" style="margin-top: 40px">
            <el-input
              v-model.trim="form.username"
              :placeholder="translateTitle('请输入手机号')"
              tabindex="1"
              type="text"
              maxlength="11"
            >
              <template #prefix>
                <!-- <vab-icon icon="user-line" />  -->
                <i class="iconfont icon-shoujihao"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="form.password"
              :placeholder="translateTitle('请输入密码')"
              :type="passwordType"
              tabindex="2"
            >
              <template #prefix>
                <!-- <vab-icon icon="lock-line" /> -->
                <i class="iconfont icon-mimasuo"></i>
              </template>
              <template v-if="passwordType === 'password'" #suffix>
                <!-- <vab-icon
                  class="show-password"
                  icon="eye-off-line"
                  @click="handlePassword"
                /> -->
                <i class="iconfont icon-eye-off-line show-password" @click="handlePassword"></i>
              </template>
              <template v-else #suffix>
                <!-- <vab-icon
                  class="show-password"
                  icon="eye-line"
                  @click="handlePassword"
                /> -->
                <i class="iconfont icon-eye-line show-password" @click="handlePassword"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-popover
              v-if="!validpass"
              placement="top"
              trigger="click">
              <slideverify @passClick="passClick" />
              <el-button slot="reference" :icon="picon">{{pmsg}}</el-button>
            </el-popover>
            <el-button v-if="validpass" class="pbtn" type="success" plain :icon="picon">{{pmsg}}</el-button>
          </el-form-item>
          <el-button
            :loading="loading"
            class="login-btn"
            type="primary"
            @click="handleLogin"
          >
            {{ translateTitle('登录') }}
          </el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {isPassword} from "@/utils/validate";
import {timeDate, timeSecond} from "@/utils/timeDate";
import {mapActions, mapGetters} from "vuex";
import validcode from "@/components/ValidCode";
import {translateTitle} from "@/utils/i18n";
import slideverify from '@/components/SlideVerify'
import {toLoginRoute} from "@/utils/routes";
import {getDecrypt, getEncrypt} from "@/utils/encryption";
export default {
  name: "login",
  directives: {
    focus: {
      inserted(el) {
        el.querySelector('input').focus()
      },
    },
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer)
    next()
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if ('' === value)
        callback(new Error(this.translateTitle('手机号不能为空')))
      else callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (!isPassword(value))
        callback(new Error(this.translateTitle('密码不能少于2位')))
      else callback()
    }
    return {
      form: {
        username: '',
        password: '',
        validcode:''
      },
      rules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      areaid:undefined,
      token:null,
      level:null,
      timer: 0,
      datefont:timeDate(),
      second:timeSecond(),
      validpass:false,
      picon:'el-icon-info',
      pmsg:'点击完成拼图验证',
      baseurl:''
    }
  },
  computed: {
    ...mapGetters({
      title: 'settings/title',
      // backData:'user/backData'
    }),
  },
  components:{
    validcode,
    slideverify
  },
  watch: {
    $route: {
      async handler(route) {
        this.redirect = (route.query && route.query.redirect) || '/'
        this.token = (route.query && route.query.token)
        this.level = (route.query && route.query.level)
        if(this.token){
          await this.getToken(this.token,this.level)
          await this.$router.push(this.handleRoute())
        }
      },
      immediate: true,
      deep:true,
    },
  },
  created() {
    this.baseurl = this.$baseUrl
  },
  mounted() {
  },
  methods: {
    ...mapActions({
      login: 'user/login',
      getToken:'user/getToken',
    }),
    translateTitle,
    passClick(val,str){
      if(val){
        this.validpass = val
        this.picon = 'el-icon-success'
        this.pmsg = `验证通过，耗时${(str / 1000).toFixed(1)}s`
      }else {
        this.validpass = val
        this.pmsg = str
        if(str == '刷新成功'){
          this.picon = 'el-icon-circle-check'
        }else {
          this.picon = 'el-icon-error'
        }
        setTimeout(()=>{
          this.picon = 'el-icon-info'
          this.pmsg = '点击完成拼图验证'
        },2000)
      }
    },
    handlePassword() {
      this.passwordType === 'password'
        ? (this.passwordType = '')
        : (this.passwordType = 'password')
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleRoute() {
      return this.redirect === '/404' || this.redirect === '/403' ? '/' : this.redirect
    },
    handleLogin() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if(!this.validpass){
            this.$message.error('请先验证拼图通过，再登录！')
            return false
          }
          try {
            this.loading = true
            let form = {
              username:getEncrypt(this.form.username),
              password:getEncrypt(this.form.password)
            }
            // Object.assign(form)
            await this.login(form)
            // this.$delete(this.form,'validcode')
            // Object.assign(this.form,{areaid:this.areaid == '/' ? 0: this.areaid})
            // await this.login(this.form)
            await this.$router.push(this.handleRoute())
            this.loading = false
          } catch {
            this.loading = false
          }
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/vab/styles/scss/login.scss";
</style>
