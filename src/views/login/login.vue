<template>
  <div class="login">
    <!-- 登录区域 -->
    <div class="login_box">
      <div class="logo_box">
        <img src="@/assets/img/logo/logo.png"  alt="">
      </div>
      <!-- 表单区域 -->
      <el-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { GetLogin } from '@/api/login/login'
import Cookies from 'js-cookie' // 导入 js-cookie 库
export default {
  name: 'LoginIndex',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async login () {
      // 登录逻辑
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          // 处理登录请求
          console.log('登录信息:', this.loginForm)
          const res = await GetLogin(this.loginForm.username, this.loginForm.password)
          console.log(res)
          if (res.code !== 200) {
            return this.$message.error('登陆失败，请联系管理人员')
          } else {
            this.$message.success('登陆成功！')
            console.log(res.token)
            Cookies.set('token', res.token)
            this.$router.push('/layout')
          }
        } else {
          console.log('验证失败')
          return false
        }
      })
      // this.$router.push('/layout')
    },
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
html, body {
  margin: 0;
  height: 100%;
  width: 100%;
  background-color: #2b4b6b; /* 设置全局背景颜色 */
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 98vh;
  /* height: 100vh;  使用视口高度 */
  /* width: 100vw; 使用视口宽度 */
  background-color: #2b4b6b;
}

/* 登录部分 */
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: relative;
}

/* 图表盒子 */
.logo_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.logo_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

/* 表单 */
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

/* 按钮 */
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
