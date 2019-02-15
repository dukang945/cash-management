<template>
  <div id="container">
    <el-container>
      <el-header>
        <div class="container-left" @click="isCollapse=!isCollapse">
          <i class="icon-webicon03 iconfont"></i>
        </div>
        <div class="container-right">
          <div class="portrait"></div>
          <div class="info">
            <span>{{userName}}</span>
            <el-dropdown @command="handleCommand">
              <i class="el-icon-arrow-down el-icon--right"></i>
              <el-dropdown-menu size="small" slot="dropdown">
                <el-dropdown-item command="logout">退出</el-dropdown-item>
                <el-dropdown-item>查看</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-container>
        <aside class="el-aside">
          
          <el-menu
            router
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            :default-active="routePath"
          >
          <div class="logo">
            <img :src="logo1" alt>
            <img :src="logo2" alt>
          </div>
          <h3 class="title">平台管理</h3>
            <el-submenu :index="item.id.toString()" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="[item.icon,'iconfont']"></i>
                <span>{{item.funName}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  :index="item.funUrl"
                  v-for="item in item.sysFunctionList"
                  :key="item.id"
                >{{ item.funName }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </aside>

        <el-main>
          <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content">
              <transition name="move" mode="out-in">
                <keep-alive :include="tagsList"></keep-alive>
              </transition>
            </div>
          </div>
          <transition name="move" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import vTags from "./Tags.vue";
import bus from "./bus";
export default {
  data() {
    return {
      menuList: [],
      tagsList: [],
      logo1:'./static/img/未标题-1.png',
      logo2:'./static/img/logo.png',
      list: {
        outTradeNo: "",
        payWay: "",
        startTime: "2019-01-15 11:07:25",
        page: "1",
        payState: "",
        endTime: "2019-01-16 14:47:46",
        rows: "10"
      },
      collapse: false,
      isCollapse: false
    };
  },
  components: {
    vTags
  },
  computed: {
    routePath() {
      let routePath = this.$route.path.substring(1);
      return routePath;
    },
    userName(){
      let userName = sessionStorage.getItem('userName')
      return userName
    }
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    getMenuList() {
      this.$axios
        .post(
          "/management/sysFunction/selectFunc",
          this.$qs.stringify({ token: sessionStorage.getItem("token") })
        )
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.menuList = res.data.data;
          }
        });
    },
    handleCommand(command) {
      command === "logout" ? this.logout() : this.show();
    },
    //退出登录
    logout() {
      this.$axios
        .post(
          "/management/sysAccount/logout",
          this.$qs.stringify({ token: sessionStorage.getItem("token") })
        )
        .then(res => {
          if (res.status == 200) {
            if (res.data.msg == "OK") {
              sessionStorage.removeItem("token");
              this.$router.push("/login");
            }
          }
        });
    },
    show() {}
  }
};
</script>

<style>
#container {
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  background: linear-gradient(90deg, #689dfd, #7c90fd);
  box-shadow: 2px 2px 3px 0 rgba(61, 61, 61, 0.5);
  line-height: 60px;
}
.el-menu {
  max-width: 200px;
}
.el-aside {
  color: #333;
  text-align: left;
  line-height: 200px;
  overflow-x: hidden;
  max-width: 200px;
  box-shadow: 2px 4px 2px #ccc;
  position: relative;
}
.logo {
  /* height: 200px; */
  max-width: 200px;
}
.title {
  font-size: 12px;
  color: #909399;
  margin-left: 16px;
  line-height: 16px;
  margin-top: 32px;
  margin-bottom: 5px;
}
.logo img {
  display: block;
}
.logo img:nth-of-type(1) {
  max-width: 55px;
  height: 55px;
  margin-left: 72.5px;
  margin-top: 50px;
}
.logo img:nth-of-type(2) {
  max-width: 166px;
  height: 20px;
  margin: 0;
  margin-left: 17px;
  margin-top: 23px;
}
.el-submenu__title:hover {
    background-color: #EDF3FF;
    color: #7CA4FF;
    font-size: 14px;
}
.el-submenu__title:hover i{
  color: #7CA4FF;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-submenu .el-menu-item {
  text-align: center;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  padding: 0;
}
.content-box{
  padding: 20px;
}
.contain-box {
  padding: 0 20px;
}
.table-box {
  padding: 15px;
  padding-bottom: 0;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 2px 4px 5px 0 rgba(238, 238, 238, 0.5);
  margin-top: 20px;
}
.table-box:nth-of-type(1){
  margin-top: -20px;
}
.function {
  padding-bottom: 20px;
}
.el-table td,
.el-table th {
  padding: 4.5px 0 !important;
}
.el-pagination {
  text-align: right;
  padding-top: 10px;
  padding-bottom: 20px;
}
.container-right {
  width: 130px;
  height: 100%;
  float: right;
}
.container-right .portrait {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  float: left;
  margin-top: 10px;
}
.container-right .info {
  float: right;
  color: #fff;
  font-size: 14px;
}
.el-dropdown {
  display: inline;
}
.container-right .info i {
  cursor: pointer;
}
.container-left {
  float: left;
  cursor: pointer;
  margin-left: 200px;
  color: #fff;
}

.el-button--primary {
  color: #fff;
  background-color: #7ca4ff;
  border-color: #7ca4ff;
}
.el-button--small {
  font-size: 14px;
  border-radius: 4px;
  padding: 9px 12px;
}
.handle{
  margin-left: 2px !important;
}
/* .el-submenu .el-menu-item{
  color: #999;
} */
</style>