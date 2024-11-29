<template>
  <div class="articles">
    <el-card>
      <!-- 发布软文表单 -->
      <el-form :model="form" :rules="rules" ref="formRef" style="margin-bottom: 20px;">
        <el-form-item label="软文标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入软文标题"></el-input>
        </el-form-item>
        <el-form-item label="软文内容" prop="content">
          <div style="border: 1px solid #ccc;">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 350px; overflow-y: hidden;"
              v-model="form.content"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
            />
          </div>
        </el-form-item>
        <el-form-item label="软文配图" prop="imageUrl">
          <el-upload
            class="upload-demo"
            action="http://localhost/dummy-url"
            list-type="picture"
            :show-file-list="false"
            :on-change="handleVideoChange"
            :before-upload="beforeVideoUpload"
          >
            <el-button type="primary">上传图片</el-button>
          </el-upload>
          <!-- <img v-if="form.imageUrl" :src="form.imageUrl" alt="image" style="width: 200px; margin-top: 10px;" /> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">{{ isEditing ? '修改' : '发布' }}</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 软文列表表格 -->
      <el-table :data="articles" border stripe>
        <el-table-column label="名称" prop="title"></el-table-column>
        <el-table-column label="软文配图" width="180">
          <template v-slot="scope">
            <img :src="scope.row.imageUrl" alt="" style="width: 100px; height: 100px; border-radius: 5px;" />
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="created"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="editArticle(scope.row.id)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteArticle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalArticles"
        @current-change="handlePageChange"
        class="pagination"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { Putarticle, GetarticleList, getuploadfile, DelBlogList, getblogdetail, Putbloglist } from '@/api/blog/blog'
export default {
  name: 'ArticlesIndex',
  components: { Editor, Toolbar },
  data () {
    return {
      articles: [
        { id: 1, title: '软文标题1', imageUrl: 'http://example.com/image1.jpg', createdAt: '2024-09-29' },
        { id: 2, title: '软文标题2', imageUrl: 'http://example.com/image2.jpg', createdAt: '2024-09-28' }
      ],
      isEditing: false,
      form: {
        title: '',
        content: '',
        imageUrl: ''
      },
      rules: {
        title: [{ required: true, message: '请输入软文标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入软文内容', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '请上传软文配图', trigger: 'blur' }]
      },
      editor: null,
      toolbarConfig: {},
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          uploadImage: {
            customUpload: async (file, insertFn) => {
              const formData = new FormData()
              formData.append('file', file)
              try {
                const response = await getuploadfile(formData)
                if (response.code === 200) {
                  const url = response.msg
                  const alt = 'Asimplefox'
                  insertFn(url, alt, '')
                  this.$message.success('图片上传成功！')
                } else {
                  this.$message.error('上传图片失败: ')
                }
              } catch (error) {
                console.error('上传图片时出错:', error)
                this.$message.error('上传图片失败！')
              }
            }
          }
        }
      },
      mode: 'default',
      currentPage: 1,
      pageSize: 1,
      totalArticles: 10
    }
  },
  methods: {
    onCreated (editor) {
      this.editor = Object.seal(editor)
    },
    handleVideoChange (file) {
      this.form.imageUrl = file.raw // 显示视频文件名称
      // this.videoForm.title = file.name
    },
    beforeVideoUpload (file) {
      return true
    },
    // handleCoverChange (file) {
    //   this.videoForm.coverUrl = file.name // 显示封面文件名称
    // },
    async submitForm () {
      // console.log('提交表单', this.form)
      // 创建博客
      if (this.isEditing === false) {
        const formData = new FormData()
        formData.append('image_url', this.form.imageUrl)
        formData.append('content', this.form.content)
        formData.append('title', this.form.title)
        // console.log('FormData:', Array.from(formData.entries()))
        const res = await Putarticle(formData)
        // console.log('结果', res)
        if (res.code === 200) {
          this.$message.success('创建博客成功！！')
          this.GetarticleList()
          this.form = {
            title: '',
            content: '',
            imageUrl: ''
          }
        }
        // 修改博客
      } else {
        // console.log('修改', this.form)
        const formData = new FormData()
        formData.append('image_url', this.form.imageUrl)
        formData.append('content', this.form.content)
        formData.append('title', this.form.title)
        formData.append('id', this.form.id)
        // console.log('FormData:', Array.from(formData.entries()))
        const res = await Putbloglist(formData)
        // console.log('结果', res)
        if (res.code === 200) {
          this.$message.success('修改博客成功！！')
          this.GetarticleList()
          this.form = {
            title: '',
            content: '',
            imageUrl: ''
          }
        } else {
          return this.$message.success('请重新上传软文配图！！')
        }
      }
    },

    async GetarticleList () {
      const res = await GetarticleList(this.currentPage)
      // console.log('列表', res)
      this.articles = res.records
      this.totalArticles = res.total
      this.pageSize = res.size
    },
    resetForm () {
      this.form = {
        id: null,
        title: '',
        content: '',
        imageUrl: ''
      }
      this.isEditing = false
    },
    async editArticle (id) {
      // console.log('修改文章', id)
      this.isEditing = true
      const res = await getblogdetail(id)
      // console.log(res)
      this.form.id = id
      this.form.title = res.title
      this.form.content = res.content
      this.form.imageUrl = res.imageUrl
      // this.form = { ...article }
    },
    deleteArticle (id) {
      // console.log('删除文章', id)
      this.$confirm('此操作将永久删除该博客, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await DelBlogList(id)
        // console.log(res)
        if (res) {
          this.$message({
            type: 'success',
            message: '博客删除成功!'
          })
          this.GetarticleList()
        } else {
          return this.$message.error('博客删除失败！！')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handlePageChange (page) {
      this.currentPage = page
      this.GetarticleList()
      // console.log('当前页:', page)
    }
  },
  mounted () {
    this.GetarticleList()
  }
}
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
