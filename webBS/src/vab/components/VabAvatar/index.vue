<template>
  <el-dropdown @command="handleCommand" @visible-change="handleVisibleChange">
    <span class="avatar-dropdown">
    <!--<el-avatar :src="avatar" class="user-avatar" />-->
      <div class="user-name">
        <span class="hidden-xs-only">欢迎您,{{ username }}</span>
        <!-- <vab-icon
          :class="{ 'vab-dropdown-active': active }"
          class="vab-dropdown"
          icon="arrow-down-s-line"
        /> -->
        <i :class="active? 'el-icon-arrow-up':'el-icon-arrow-down'"></i>
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="editPass">
          <!-- <vab-icon icon="edit-2-line" /> -->
          <i class="el-icon-lock"></i>
          {{ translateTitle('修改密码') }}
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <!-- <vab-icon icon="logout-circle-r-line" /> -->
          <i class="el-icon-switch-button"></i>
          {{ translateTitle('退出登录') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="28%" top="13%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
      <el-form ref="formData" :model="formData" :rules="rules" status-icon label-width="90px">
        <el-form-item label="旧密码" prop="oldpwd">
          <el-input type="password" v-model="formData.oldpwd" placeholder="请输入旧密码" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="pwd">
          <el-input type="password" v-model="formData.pwd" placeholder="请输入新密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="repwd">
          <el-input type="password" v-model="formData.repwd" placeholder="请输入确认密码" show-password />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="savePass">保 存</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </el-dropdown>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapActions, mapGetters } from 'vuex'
  import { toLoginRoute } from '@/utils/routes'
  import Vue from "vue";
  import {editPass} from '@/api/user'
  export default {
    name: 'VabAvatar',
    data() {
      return {
        active: false,
        title:'',
        dialogVisible:false,
        formData:{},
        rules:{
          oldpwd:[{required: true, trigger: "blur", message: "请填写旧密码"}],
          pwd:[{required: true, trigger: "blur", message: "请填写新密码"}],
          repwd:[{required: true, trigger: "blur", message: "请填写确认密码"}]
        },
        areaid:null
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        username: 'user/username',
        userData:'user/userData'
      }),
    },
    mounted() {
      this.areaid = this.userData.areaid
    },
    methods: {
      translateTitle,
      ...mapActions({
        _logout: 'user/logout',
      }),
      handleCommand(command) {
        switch (command) {
          case 'logout':
            this.logout()
            break
          case 'editPass':
            this.editPass()
            break
        }
      },
      handleVisibleChange(val) {
        this.active = val
      },
      logout() {
        Vue.prototype.$baseConfirm('你确定要退出登录吗？','信息提示',async ()=>{
          await this._logout()
          await this.$router.push(toLoginRoute(this.areaid))
        })
      },
      editPass(){
        this.dialogVisible = true
        this.title = '修改密码'
      },
      savePass(){
        this.$refs.formData.validate(async (valid)=>{
          if(valid){
            if(this.formData.pwd !== this.formData.repwd){
              this.$message.error('两次输入的密码不一致')
              return false
            }
            let params = {
              uid:this.userData.pid,
              oldpwd:this.formData.oldpwd,
              pwd:this.formData.pwd
            }
            let res = await editPass(params)
            if(res.code === 200){
              this.$message.success('修改成功')
              await this._logout()
              await this.$router.push(toLoginRoute(this.areaid))
            }
          }else{
            return false
          }
        })
      },
      handleClose(){
        this.dialogVisible = false
        this.$refs.formData.resetFields();
        this.formData = this.$options.data().formData;
      },
    },
  }
</script>

<style lang="scss" scoped>
.el-dropdown{
  margin-left:15px;
.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;

  .user-avatar {
    width: 40px;
    height: 40px;
    margin-left: 15px;
    cursor: pointer;
    border-radius: 50%;
  }

  .user-name {
    position: relative;
    display: flex;
    align-content: center;
    align-items: center;
    height: 40px;
    margin-left: 6px;
    line-height: 40px;
    cursor: pointer;

    [class*='ri-'] {
      margin-left: 0 !important;
    }
  }
}
.dialog-footer{
  .el-button--small{
    padding: 12px 20px;
    font-size: 14px;
  }
}
}
</style>
