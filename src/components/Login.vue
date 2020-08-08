<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avater_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单 -->
      <el-form class="bd-tjq" ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入账号"
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
            >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password">
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm:{
        username:'admin',
        password:'123456',
      },
      loginFormRules:{
        // 验证用户名
        username:[
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm(){
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      this.$refs.loginFormRef.validate(async vaild =>{
        if(!vaild) return;
        const {data: res} = await this.$http.post('login',this.loginForm);
        console.log(res);
        if(res.meta.status != 200) return this.$message.error('登录失败');
        this.$message.success('登录成功');
        // console.log(res);
        window.sessionStorage.setItem('token', res.data.token);
        this.$router.push('/home')

      })
    }
  },
};
</script>

<style lang="less">
.login_container {
  background-color: #2b4b6b;
  position: fixed;
  width: 100%;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avater_box {
    height:130px;
    width:130px;
    border:1px solid #eee;
    background-color: #fff;
    border-radius:50%;
    padding:10px;
    box-shadow: 0 0 10px #ddd;
    margin: auto;
    margin-top:-75px;
      img{
        width:100%;height:100%;display: block;border-radius:50%;background-color: #eee;
      }
  }

  .bd-tjq{width:80%;overflow:hidden;margin: auto;margin-top:30px;text-align: center;}
}
</style>