<template>
  <div>
    登录成功页面


   
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
 
  methods: {
    logout(){
      window.sessionStorage.clear();
      this.$router.push('/login');
      this.$message.success('退出成功');
      
    }
  },
}
</script>