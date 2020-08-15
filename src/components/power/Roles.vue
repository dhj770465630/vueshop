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
                      v-for="item3 in item2.children"
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
          <template v-slot="slot">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-share"
              @click="showsetRightDialog(slot.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限分配对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisble"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="auManagement"
        show-checkbox
        :props="defaultProps"
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
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
      // 分配权限列表数据
      auManagement: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      // 默认选中数组id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
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
    showsetRightDialog(role) {
      this.roleId = role.id;
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisble = true;
      this.$http
        .get("rights/tree")
        .then((res) => {
          console.log(res.data);
          this.auManagement = res.data.data;
        })
        .catch((err) => {
          console.log("获取失败");
        });
    },
    // 通过递归的形式获取角色下所有的三级权限id，并保存到数组defKeys中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    // 监听分配权限规划框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },

    // 为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("分配角色权限失败");
      }

      this.$message.success("分配权限成功");
      this.rolesList();
      this.setRightDialogVisble = false;
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