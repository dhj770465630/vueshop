<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mbx-nav">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="canz" border style="width: 100%" stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template v-slot="slot">
            <el-row
              class="buydw-l"
              :class="['bor-bot', i1 === 0 ? 'bor-top' : 'bor-bot']"
              v-for="(item1, i1) in slot.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 二级 -->
                <el-row
                  :class="[i2 === 0 ? ' ' : 'bor-top']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  class="buydw-l"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(slot.row , item3.id)"
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre> {{slot.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot>
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-share"
              @click="showsetRightDialog"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限分配对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisble" width="50%">
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogVisble = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  name: "Roles",
  data() {
    return {
      // 所有角色列表数据
      canz: [],
      // 控制分配权限对话框的显示/隐藏
      setRightDialogVisble: false,

      
    };
  },
  created() {
    this.rolesList();
  },
  methods: {
    rolesList() {
      this.$http
        .get("roles")
        .then((res) => {
          this.canz = res.data.data;
        })
        .catch((error) => {
          this.$message.error("获取列表失败了");
        });
    },
    async removeRightById(role, rightId) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该标签, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult != "confirm") {
        return this.$message.info("取消了删除");
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );

      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      // this.rolesList()

      role.children = res.data;
    },
    // 展示分配权限对话框
    showsetRightDialog() {
      (this.setRightDialogVisble = true),
        this.$http.get("rights/tree").then((res) => {
          console.log(res.data);
        });
    },
  },
};
</script>

<style  scope>
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin: 10px 10px 10px 0;
}
.bor-bot {
  border-bottom: 1px solid #eee;
}
.bor-top {
  border-top: 1px solid #eee;
}
</style>