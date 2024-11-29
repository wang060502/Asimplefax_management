<template>
  <div>
    <el-card>
      <h2>权限管理</h2>

      <el-table :data="paginatedAdmins" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="name" label="管理员名称" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="phone" label="电话" width="150"></el-table-column>
        <el-table-column label="身份" width="150">
          <template slot-scope="scope">
            <el-tag :type="scope.row.role === '超级管理员' ? 'danger' : ''">
              {{ scope.row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="deleteAdmin(scope.row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="admins.length"
        @current-change="handlePageChange"
        layout="total, prev, pager, next"
        style="margin-top: 20px;"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'permissionsIndex',
  data () {
    return {
      currentPage: 1,
      pageSize: 5,
      admins: [
        {
          name: '管理员 A',
          email: 'adminA@example.com',
          phone: '1234567890',
          role: '管理员'
        },
        {
          name: '超级管理员 B',
          email: 'adminB@example.com',
          phone: '0987654321',
          role: '超级管理员'
        }
        // 添加更多管理员数据
      ]
    }
  },
  computed: {
    paginatedAdmins () {
      const start = (this.currentPage - 1) * this.pageSize
      return this.admins.slice(start, start + this.pageSize)
    }
  },
  methods: {
    handlePageChange (page) {
      this.currentPage = page
    },
    deleteAdmin (admin) {
      this.admins = this.admins.filter(item => item !== admin)
      this.$message.success(`删除管理员: ${admin.name}`)
    }
  }
}
</script>

<style>
/* 可以在这里添加样式 */
</style>
