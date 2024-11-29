<template>
  <div class="user-comments">
    <el-card>
      <h2>用户留言列表</h2>
      <el-table :data="comments" border>
        <el-table-column prop="username" label="用户名称" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="phone" label="电话号码" width="150"></el-table-column>
        <el-table-column prop="subject" label="留言主题" width="200"></el-table-column>
        <el-table-column prop="content" label="留言内容"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteComment(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="totalComments"
        @current-change="handlePageChange">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'userComments',
  data () {
    return {
      comments: [], // 存储留言数据
      currentPage: 1,
      pageSize: 10,
      totalComments: 0
    }
  },
  methods: {
    fetchComments () {
      // 请求留言数据（这里使用模拟数据）
      const total = 50 // 假设总共有50条留言
      const start = (this.currentPage - 1) * this.pageSize
      this.comments = Array.from({ length: this.pageSize }, (_, index) => ({
        id: start + index + 1,
        username: `用户${start + index + 1}`,
        email: `user${start + index + 1}@example.com`,
        phone: `123-456-789${start + index + 1}`,
        subject: `主题${start + index + 1}`,
        content: `这是一条留言内容示例${start + index + 1}`
      }))
      this.totalComments = total
    },
    deleteComment (id) {
      // 删除留言逻辑（这里是模拟）
      this.comments = this.comments.filter(comment => comment.id !== id)
      this.totalComments -= 1
    },
    handlePageChange (page) {
      this.currentPage = page
      this.fetchComments()
    }
  },
  mounted () {
    this.fetchComments() // 组件挂载时请求留言数据
  }
}
</script>

<style scoped>
</style>
