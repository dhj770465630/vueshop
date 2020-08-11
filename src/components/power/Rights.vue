<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mbx-nav">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList" border style="width: 100%" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="slot">
            <el-tag v-if="slot.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="slot.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
            <!-- <el-tag type="warning">{{slot.row.level}}级权限</el-tag> -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      // 权限列表
      rightsList: [],
    };
  },
  created() {
    // 获取权限
    this.getRightsList();
  },
  methods: {
    // async getRightsList() {
    //   const { data: res } = await this.$http.get("rights/list")
    //   this.rights = res.data;
    //   if(res.meta.status !== 200) return this.$message.error('获取失败')
    //   console.log(res);
    // },
    getRightsList() {
      this.$http
        .get("rights/list")
        .then((res) => {
          this.rightsList = res.data.data;
          console.log(res.data);
        })
        .catch((error) => {
          this.$message.error("获取权限列表失败");
          console.log(error);
        });
    },
  },
};
</script>