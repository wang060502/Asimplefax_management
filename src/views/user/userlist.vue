<template>
  <div class="userlist">
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 用户搜索 -->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchQuery" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="displayedUsers" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="昵称" prop="nickname"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="telephone"></el-table-column>
        <el-table-column label="操作" width="320px">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="指定管理员" placement="top">
              <el-button type="primary" size="mini">指定管理员</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除用户" placement="top">
              <el-button type="warning" icon="el-icon-warning" size="mini" @click="DelUserList(scope.row.id)">删除</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="重置密码" placement="top">
              <el-button type="info" icon="el-icon-key" size="mini">重置密码</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible">
      <el-form :model="addForm" ref="addFormRef" :rules="formRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="addForm.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="addForm.telephone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addUser">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetUserList, DelUserList, PostUserList } from '@/api/login/login'

export default {
  name: 'UserlistIndex',
  data () {
    return {
      searchQuery: '',
      displayedUsers: [],
      total: 0,
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        telephone: ''
      },
      formRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: '请确认密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
        ],
        telephone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const res = await GetUserList(this.queryInfo.pagenum)
      console.log(res)

      this.displayedUsers = res.records || []
      this.total = res.total || 0
    },
    // 管理员添加账号
    async addUser () {
      if (this.addForm.password !== this.addForm.confirmPassword) {
        return this.$message.error('两次密码不一致，请重新输入！！')
      } else {
        console.log('添加用户:', this.addForm)
        const res = await PostUserList(this.addForm.username, this.addForm.password, this.addForm.email, this.addForm.telephone)
        if (res.code !== 200) {
          return this.$message.error('添加用户失败，请联系管理员重试！！')
        } else {
          console.log(res)
          this.$message.success('添加用户成功！！')
          this.addDialogVisible = false
          this.getUserList()
        }
      }
    },
    // 删除用户
    async DelUserList (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await DelUserList(id)
        console.log(res)
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUserList()
        } else {
          return this.$message.error('删除失败！！')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      this.getUserList()
    },
    handleCurrentChange (page) {
      this.queryInfo.pagenum = page
      this.getUserList()
    }
  }
}
</script>

<style scoped>
/* Add your scoped styles here */
</style>
