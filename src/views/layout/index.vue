<template>
  <div class="home">
    <el-container class="home_container">
      <el-header class="header">
        <div class="header-left">
          <div class="homelogo">
            <img src="@/assets/img/logo/logo.png" alt="Logo">
          </div>
          <div class="homeheader">Asimplefox 后台管理系统</div>
        </div>
        <el-button type="info" class="header-right" @click="getexit">退出</el-button>
      </el-header>
      <el-container>
        <el-aside width="210px">
          <el-menu default-active="1" background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
            <el-submenu index="home">
              <template slot="title">
                <i class="el-icon-house"></i>
                <span>首页</span>
              </template>
              <el-menu-item index="home-1" @click="$router.push('/banner')">首页轮播图管理</el-menu-item>
              <el-menu-item index="home-2" @click="$router.push('/PopularSkitsList')">热门短剧列表</el-menu-item>
              <el-menu-item index="home-3" @click="$router.push('/NewlyLaunchedSkitsList')">新上线短剧列表</el-menu-item>
              <el-menu-item index="home-4" @click="$router.push('/RecommendedSkitsList')">今日推荐短剧列表</el-menu-item>
            </el-submenu>
            <el-submenu index="user">
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="user-1" @click="$router.push('/userlist')">用户列表</el-menu-item>
              <!-- <el-menu-item index="user-2" @click="$router.push('/usercomments')">用户留言列表</el-menu-item> -->
            </el-submenu>
            <el-menu-item index="articles" @click="$router.push('/articles')">
              <i class="el-icon-document"></i>
              <span slot="title">软文管理</span>
            </el-menu-item>
            <el-menu-item index="analytics" @click="$router.push('/analytics')">
              <i class="el-icon-data-analysis"></i>
              <span slot="title">数据分析</span>
            </el-menu-item>
            <el-menu-item index="permissions" @click="$router.push('/permissions')">
              <i class="el-icon-lock"></i>
              <span slot="title">权限管理</span>
            </el-menu-item>
            <!-- 视频管理菜单 -->
            <el-submenu index="videos">
              <template slot="title">
                <i class="el-icon-video-camera"></i>
                <span>视频管理</span>
              </template>
              <!-- <el-menu-item index="videos-add" @click="$router.push('/videoadd')">视频添加</el-menu-item> -->
              <el-menu-item index="videos-list" @click="$router.push('/videolist')">视频列表</el-menu-item>
            </el-submenu>
            <div v-if="this.userName === 'admin'">
              <el-submenu index="deployment">
                <template slot="title">
                  <i class="el-icon-upload2"></i>
                  <span>前端包自助部署管理</span>
                </template>
                <el-menu-item index="deployment-1" @click="$router.push('/Codedeployment')">代码部署管理</el-menu-item>
              </el-submenu>
              <el-submenu index="BGdeployment">
                <template slot="title">
                  <i class="el-icon-upload2"></i>
                  <span>后台包自助部署管理</span>
                </template>
                <el-menu-item index="BGdeployment-1" @click="$router.push('/BGCodedeployment')">代码部署管理</el-menu-item>
              </el-submenu>
            </div>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
// import { removeInfo } from '@/utils/storage'
// import { getuserinfo } from '@/api/login/login'
export default {
  name: 'LayoutIndex',
  data () {
    return {
      userName: ''
    }
  },
  mounted () {
    // this.getuserinfo()
  },
  methods: {
    getexit () {
      // 删除 Cookie 中的 token
      Cookies.remove('token') // 清除 token
      // 跳转到登录页面
      this.$router.push('/login')
      this.$message.success('退出系统成功')
    }
    // // 获取用户信息
    // async getuserinfo () {
    //   const res = await getuserinfo()
    //   // console.log(res)
    //   this.userName = res.data.userAccount
    // }
  }
}
</script>

<style scoped>
.home_container {
  height: 98vh;
}

/* 头部区域 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(38, 38, 43);
}

.header-left {
  display: flex;
  align-items: center;
}

.homelogo {
  width: 80px;
  height: 80px;
  margin-right: 10px;
}

.homelogo img {
  width: 100%;
  height: 100%;
}

.homeheader {
  color: white;
  font-size: 22px;
  margin-left: 20px;
}

.header-right {
  align-self: center;
}

/* 侧边栏区域 */
.el-aside {
  background-color: #333744;
}

.custom-menu {
  background-color: #545c64 !important;
  color: #fff !important;
}

.custom-menu .el-menu-item.is-active {
  color: #ffd04b !important;
}

.custom-menu .el-submenu__title {
  color: #fff !important;
}

/* 防止二级菜单展开时位移 */
.custom-menu .el-menu-item,
.custom-menu .el-submenu__title {
  padding-left: 20px !important;
  margin: 0 !important;
}

/* 主题内容区域 */
.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
