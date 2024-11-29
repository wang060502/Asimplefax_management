<template>
  <div class="banner">
    <el-card>
      <el-button type="primary" @click="opendrawer">添加轮播图</el-button>

      <!-- 查询功能 -->
      <el-input
        v-model="search"
        placeholder="搜索标题"
        style="margin: 20px 0;"
        @input="handleSearch"
      >
      </el-input>

      <!-- 轮播图列表 -->
      <el-table :data="paginatedCarouselList" border stripe>
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="介绍" prop="desc"></el-table-column>
        <el-table-column label="图片地址" prop="url"></el-table-column>
        <el-table-column label="图片" width="600">
          <template slot-scope="scope">
            <img :src="scope.row.url" alt="" style="width: 180px; height: 100px; border-radius: 5px;" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="editItem(scope.row)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeItem(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        background
        :current-page="currentPage"
        :page-size="pageSize"
        :total="filteredCarouselList.length"
        layout="total, prev, pager, next, sizes"
        :page-sizes="[4, 10, 15, 20]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </el-card>

    <!-- 添加轮播图抽屉 -->
    <el-drawer title="添加轮播图" :visible.sync="drawerVisible" @close="resetForm" :size="'30%'">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="description">
          <el-input v-model="form.description" placeholder="请输入介绍"></el-input>
        </el-form-item>
        <el-form-item label="图片上传" prop="image">
        <el-upload
          class="upload-demo"
          drag
          ref="upload"
          action="/"
          :show-file-list="false"
          :before-upload="beforeUpload"
          @change="handleFileChange"
          :auto-upload="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-image v-if="fileLink" style="width: 300px; height: 150px;margin-left: 80px;" :src="fileLink"></el-image>
      </el-form-item>

      </el-form>
      <div class="drawer-footer">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">添加轮播图</el-button>
      </div>
    </el-drawer>

     <!-- 修改轮播图抽屉 -->
     <el-drawer title="修改轮播图" :visible.sync="ChanegdrawerVisible" @close="resetForm" :size="'30%'">
      <el-form :model="changeform" :rules="rules" ref="formRef">
        <el-form-item label="标题" prop="title">
          <el-input v-model="changeform.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="description">
          <el-input v-model="changeform.description" placeholder="请输入介绍"></el-input>
        </el-form-item>
        <el-form-item label="图片上传" prop="image">
        <el-upload
          class="upload-demo"
          drag
          ref="upload"
          action="/"
          :show-file-list="false"
          :before-upload="beforeUpload"
          @change="handleFileChange"
          :auto-upload="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-image v-if="fileLink" style="width: 300px; height: 150px;margin-left: 80px;" :src="fileLink"></el-image>
      </el-form-item>

      </el-form>
      <div class="drawer-footer">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="changesubmitForm">修改</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { GetBannerList, PostBaner, DelBannerList, ChangeBaneerList } from '@/api/home/home'
export default {
  name: 'BannerIndex',
  data () {
    return {
      drawerVisible: false,
      ChanegdrawerVisible: false,
      fileLink: '', // 初始为空
      form: {
        title: '',
        description: '',
        image: ''
      },
      changeform: {
        id: '',
        title: '',
        description: '',
        image: ''
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        description: [{ required: true, message: '请输入介绍', trigger: 'blur' }],
        image: [{ required: true, message: '请输入图片地址', trigger: 'blur' }]
      },
      carouselList: [
        { id: 1, title: '轮播图 1', description: '介绍 1', banner: 'https://via.placeholder.com/150' },
        { id: 2, title: '轮播图 2', description: '介绍 2', banner: 'https://via.placeholder.com/150' },
        { id: 3, title: '轮播图 3', description: '介绍 3', banner: 'https://via.placeholder.com/150' },
        { id: 4, title: '轮播图 4', description: '介绍 4', banner: 'https://via.placeholder.com/150' }
      ], // 模拟的轮播图列表数据
      search: '',
      currentPage: 1,
      pageSize: 4
    }
  },
  computed: {
    filteredCarouselList () {
      return this.carouselList.filter((item) =>
        item.title.includes(this.search) || item.desc.includes(this.search)
      )
    },
    paginatedCarouselList () {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredCarouselList.slice(start, end)
    }
  },
  mounted () {
    this.GetBannerList()
  },
  methods: {
    async GetBannerList () {
      const res = await GetBannerList()
      console.log(res)
      this.carouselList = res
    },
    opendrawer () {
      this.drawerVisible = true
      this.fileLink = ''
    },
    beforeUpload (file) {
    // 可添加文件类型、大小等验证
      console.log('上传文件前', file)
      return true // 返回 true 继续上传
    },
    handleFileChange (file) {
      this.fileLink = file.raw // 获取文件对象
      // 使用 URL.createObjectURL 创建本地预览链接
      this.fileLink = URL.createObjectURL(file.raw) // 这里获取文件对象
    },
    async submitForm () {
      const formData = new FormData()
      const uploadFile = this.$refs.upload.uploadFiles[0] // 获取第一个上传的文件

      if (uploadFile) {
        formData.append('url', uploadFile.raw) // 取出文件对象
      } else {
        this.$message.error('未找到上传的文件')
        return // 如果没有文件则退出
      }

      formData.append('title', this.form.title)
      formData.append('desc', this.form.description)
      formData.append('jump', 'null')
      // formData.append('st', '')

      console.log('提交表单', Array.from(formData.entries()))
      const res = await PostBaner(formData)
      console.log('接口响应', res)
      if (res.code !== 1) {
        return this.$message.error('首页轮播图上传失败')
      } else {
        this.drawerVisible = false
        this.$message.success('首页轮播图添加成功！！')
        this.GetBannerList()
      }
    },
    handleSearch () {
      this.currentPage = 1 // 搜索时重置页码
    },
    handleCurrentChange (page) {
      this.currentPage = page
    },
    handleSizeChange (size) {
      this.pageSize = size
      this.currentPage = 1 // 更改页面大小时重置页码
    },
    editItem (item) {
      console.log('修改项目', item)
      this.ChanegdrawerVisible = true
      this.changeform.title = item.title
      this.changeform.description = item.desc
      this.fileLink = item.url
      this.changeform.id = item.id
    },
    async changesubmitForm () {
      const formData = new FormData()
      const uploadFile = this.$refs.upload.uploadFiles[0] // 获取第一个上传的文件

      if (uploadFile) {
        formData.append('url', uploadFile.raw) // 取出文件对象
      } else {
        this.$message.error('未找到上传的文件')
        return // 如果没有文件则退出
      }
      formData.append('id', this.changeform.id)
      formData.append('title', this.changeform.title)
      formData.append('desc', this.changeform.description)
      formData.append('jump', 'null')
      // formData.append('st', '')

      console.log('提交表单', Array.from(formData.entries()))
      if (this.fileLink === '') {
        return this.$message.error('请重新上传图片！！')
      } else {
        console.log(this.changeform, this.fileLink)
      }
      const res = await ChangeBaneerList(formData)
      console.log('接口响应', res)
      if (res.code !== 1) {
        return this.$message.error('首页轮播图修改失败')
      } else {
        this.ChanegdrawerVisible = false
        this.$message.success('首页轮播图修改成功！！')
        this.GetBannerList()
      }
    },
    async removeItem (id) {
      console.log('删除项目', id)
      const res = await DelBannerList(id)
      console.log(res)
      if (res !== true) {
        return this.$message.error('删除失败')
      } else {
        this.$message.success('删除成功')
        this.GetBannerList()
      }

      this.carouselList = this.carouselList.filter(item => item.id !== id) // 删除指定项目
    },
    resetForm () {
      this.form.title = ''
      this.form.description = ''
      this.form.image = ''
      this.changeform.title = ''
      this.changeform.description = ''
      this.changeform.image = ''
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields()
      }
    }
  }
}
</script>

<style scoped>
.drawer-footer {
  text-align: right;
  margin-top: 20px;
}
</style>
