<template>
  
    <el-container class="home-container">
      <el-header class="home-head">
        <div><img src="../assets/logo.png" alt=""><span>电商后台管理系统</span></div>
        <el-button type="info" @click="logout">退出登录</el-button>
      </el-header>
      <el-container>
        <el-aside class="home-aside" :width="zdsx ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleBbutton">|||</div>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            unique-opened
            :collapse= 'zdsx'
            :collapse-transition="false"
            router
            :default-active="activePath"
            active-text-color="#409eff">
            <el-submenu :index="item.id + ''" v-for="item in MenuList" :key="item.id">
              <template slot="title">
                <i :class="icontb[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
             
                <el-menu-item :index="'/' + subItem.path + ''" v-for="subItem in item.children" :key="subItem.id" @click="bcztd('/' + subItem.path + '')">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subItem.authName}}</span>
                  </template>
                </el-menu-item>
            </el-submenu>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">导航二</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        
        <el-main class="home-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      MenuList: [],
      icontb:{
        '125': 'el-icon-user',
        '103': 'el-icon-warning-outline',
        '101': 'el-icon-goods',
        '102': 'el-icon-price-tag',
        '145': 'el-icon-data-line',
      },
       zdsx: false,
       activePath: '',
    }
  },
  created() {
    this.getMenuList(),
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout(){
      window.sessionStorage.clear();
      this.$router.push('/login');
      this.$message.success('退出成功');
    },
    // 获取所有菜单
    async getMenuList(){
      const { data : res } =await this.$http.get('menus');
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.MenuList = res.data
      console.log(res);
    },

    // 点击按钮折叠展开导航
    toggleBbutton(){
      this.zdsx = !this.zdsx
    },
    bcztd(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
}
</script>


<style lang="less">
  .home-container{height:100%;}
  .home-head{background-color: #373d41;display: flex;justify-content: space-between;align-items: center;color:#fff;font-size:20px;}
  .home-head>div{align-items: center;display: flex;
    span{
      margin-left: 20px;letter-spacing: 1px;
    }
  }
  .home-head img{display:inline-block;height:40px;}
  .home-aside{background-color: #333744;
    .el-menu{border-right:0;}
  }
  .home-main{background-color: #eaedf1;}
  .toggle-button{background-color: #4a5064;font-size:10px;line-height:24px;color: #fff;text-align: center;letter-spacing:0.2em;cursor: pointer;}
</style>