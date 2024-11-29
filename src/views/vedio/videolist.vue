<template>
  <div class="videolist">
    <el-card>
      <h2>视频列表</h2>

      <!-- 添加视频按钮 -->
      <el-button type="primary" @click="openAddDialog">添加视频</el-button>

      <el-select v-model="selectedType" placeholder="选择视频分类" style="margin-left: 10px;" @change="handleTypeChange">
      <el-option label="短剧" value="0"></el-option>
      <el-option label="国风动漫" value="1"></el-option>
    </el-select>

      <el-form  inline style="margin-top: 20px;">
        <el-form-item label="视频名称">
          <el-input v-model="title" placeholder="请输入视频名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchVideos">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="this.videos" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="name" label="视频名称" width="180"></el-table-column>
        <el-table-column prop="icon" label="视频封面" width="180">
          <template slot-scope="scope">
            <el-image :src="scope.row.icon" style="width: 100px; height: 100px;" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="视频简介" width="300"></el-table-column>
        <el-table-column prop="type" label="视频状态" width="120"></el-table-column>
        <el-table-column prop="ftype" label="视频分类" width="120">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.ftype === 0"
              type="success"
            >短剧</el-tag>
            <el-tag
              v-else
              type="warning"
            >国风动漫</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button @click="SelVediolists(scope.row)" type="success">查看</el-button>
            <el-button type="warning" @click="openVedioList(scope.row)">添加剧集</el-button>
            <el-button @click="openEditDialog(scope.row)" type="primary">修改</el-button>
            <el-button @click="deleteVideo(scope.row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :total="totalVideos"
      @current-change="handlePageChange"
      layout="total, prev, pager, next"
      style="margin-top: 20px;"
    ></el-pagination>

      <!-- 添加视频的弹窗 -->
      <el-dialog :title="'添加视频'" :visible.sync="dialogVisible">
        <el-form :model="currentVideoForm">
          <el-form-item label="视频名称">
            <el-input v-model="currentVideoForm.name" placeholder="请输入视频名称"></el-input>
          </el-form-item>
          <el-form-item label="视频封面">
            <el-upload
              class="upload-demo"
              drag
              action="null"
              ref="upload"
              :on-change="handleCoverChange"
              :before-upload="beforeCoverUpload"
              :show-file-list="false"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">拖拽封面到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="视频简介">
            <el-input v-model="currentVideoForm.desc" placeholder="请输入视频简介"></el-input>
          </el-form-item>

          <el-form-item label="选择视频分类">
          <el-select v-model="currentVideoForm.type" placeholder="选择状态">
            <el-option label="完结" value="完结"></el-option>
            <el-option label="连载" value="连载"></el-option>
          </el-select>
          <el-select v-model="currentVideoForm.ftype" placeholder="选择分类" style="margin-left: 10px;">
            <el-option label="短剧" value="0"></el-option>
            <el-option label="国风动漫" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择视频标签" >
          <br>
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="(item,index) in typeslist" :key="index" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addVideo()">保 存</el-button>
        </div>
      </el-dialog>

            <!-- 修改视频的弹窗 -->
            <el-dialog :title="'修改视频'" :visible.sync="UpdatedialogVisible">
        <el-form :model="currentVideoForm">
          <el-form-item label="视频名称">
            <el-input v-model="currentVideoForm.name" placeholder="请输入视频名称"></el-input>
          </el-form-item>
          <el-form-item label="视频封面">
            <el-upload
              class="upload-demo"
              drag
              action="null"
              ref="upload"
              :on-change="handleCoverChange"
              :before-upload="beforeCoverUpload"
              :show-file-list="false"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">拖拽封面到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="视频简介">
            <el-input v-model="currentVideoForm.desc" placeholder="请输入视频简介"></el-input>
          </el-form-item>

          <el-form-item label="选择视频分类">
          <el-select v-model="currentVideoForm.type" placeholder="选择状态">
            <el-option label="完结" value="完结"></el-option>
            <el-option label="连载" value="连载"></el-option>
          </el-select>
          <el-select v-model="currentVideoForm.ftype" placeholder="选择分类" style="margin-left: 10px;">
        <el-option label="短剧" value="0"></el-option>
        <el-option label="国风动漫" value="1"></el-option>
      </el-select>

        </el-form-item>

        <el-form-item label="选择视频标签" >
          <br>
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="(item,index) in typeslist" :key="index" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="UpdatedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateVideo()">修 改</el-button>
        </div>
      </el-dialog>

      <!-- 查看对应视频下的剧集 -->
 <el-dialog :title="'查看剧集'" :visible.sync="SeldialogVisible" width="50%">
      <el-table :data="episodesList" border style="width: 100%">
        <el-table-column prop="stName" label="剧集名称" width="150"></el-table-column>
        <el-table-column label="视频链接">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="astrict" label="VIP剧集" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.astrict ? 'success' : 'info'">
              {{ scope.row.astrict ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 操作列：添加删除按钮 -->
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

          <!-- 添加对应视频下的剧集 -->
 <el-dialog :title="'添加对应剧集'" :visible.sync="UpdatevediodialogVisible" width="50%">
  <el-form :model="videoForm" ref="videoFormRef" :rules="rules">
        <!-- <el-form-item label="视频名称" prop="title" required>
          <el-input v-model="videoForm.title" placeholder="请输入视频名称"></el-input>
        </el-form-item> -->

        <el-form-item label="上传视频" prop="videoUrl" required>
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :on-change="handleVideoChange2"
            :before-upload="beforeVideoUpload2"
            :show-file-list="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">拖拽视频到此处，或<em>点击上传</em></div>
          </el-upload>
          <el-input v-model="videoForm.title" placeholder="上传后会显示视频链接" disabled></el-input>
        </el-form-item>

        <!-- <el-form-item label="所属电视剧" prop="tvSeries" required>
          <el-select v-model="videoForm.tvSeries" placeholder="选择所属电视剧">
            <el-option v-for="series in tvSeriesList" :key="series.id" :label="series.name" :value="series.id"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="上传剧集" prop="episodeCount" required>
          <el-input-number
            v-model="videoForm.episodeCount"
            :min="1"
            :max="100"
            label="剧集数量"
            style="width: 20%"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="VIP剧集" prop="delivery" >
          <el-switch v-model="videoForm.astrict"></el-switch>
        </el-form-item>

        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { GetVedioList, PostVedioList, PutVedioList, DelVedioList, SelVediodetail, DelVediodetail, PostAddVedio, GetTypelist } from '@/api/vedio/vedio'
import { GetSearch } from '@/api/home/home'
export default {
  name: 'videolistIndex',
  data () {
    return {
      searchForm: {
        name: ''
      },
      currentVideoForm: {
        name: '',
        icon: '',
        desc: '',
        type: '',
        ftype: ''
      },
      dialogVisible: false,
      UpdatedialogVisible: false,
      SeldialogVisible: false,
      UpdatevediodialogVisible: false,
      currentPage: 1,
      pageSize: 5,
      totalVideos: 0,
      videos: [],
      SelVedioId: '',
      episodesList: [],
      title: '',
      selectedType: '0',
      //
      videoForm: {
        title: '',
        videoUrl: '',
        coverUrl: '',
        description: '',
        status: '',
        duration: '',
        episodeCount: 1,
        tvSeries: '', // 新增字段，表示所属电视剧
        astrict: false
      },
      tvSeriesList: [
        { id: 1, name: '电视剧 A' },
        { id: 2, name: '电视剧 B' },
        { id: 3, name: '电视剧 C' }
      ], // 假设的电视剧列表，实际数据可以从 API 获取
      rules: {
        videoUrl: [
          { required: true, message: '请上传视频文件', trigger: 'change' }
        ],
        episodeCount: [
          { required: true, message: '请输入剧集数量', trigger: 'blur' },
          { type: 'number', min: 1, max: 100, message: '剧集数量必须在 1 到 100 之间', trigger: 'change' }
        ]
      },
      checkList: [],
      typeslist: []
    }
  },
  computed: {
    filteredVideos () {
      console.log('搜索条件:', this.searchForm.title)
      console.log('所有视频:', this.videos)
      return this.videos.filter(video =>
        video.name.includes(this.searchForm.name)
      )
    },
    paginatedVideos () {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredVideos.slice(start, start + this.pageSize)
    }
  },
  mounted () {
    this.GetVedioList()
    this.GetTypelist()
    console.log(this.filteredVideos) // 移到这里
  },
  methods: {
    // 获取视频列表
    async GetVedioList () {
      const res = await GetVedioList(this.currentPage, Number(this.selectedType))
      console.log(res)
      console.log('1', this.selectedType)
      this.videos = res.records
      this.totalVideos = res.total
      console.log(this.videos) // 确认数据加载成功
    },
    // 监听选择状态变化
    handleTypeChange () {
      console.log(this.selectedType)
      this.currentVideoForm.ftype = Number(this.selectedType)
      this.currentPage = 1
      this.GetVedioList()
    },
    openAddDialog () {
      this.currentVideoForm = { name: '', icon: '', desc: '' } // 重置表单
      this.checkList = []
      this.dialogVisible = true
    },
    openEditDialog (video) {
      console.log(video)

      this.currentVideoForm = { ...video }
      console.log('修改列表', this.currentVideoForm)
      this.checkList = this.currentVideoForm.types
      this.UpdatedialogVisible = true
    },
    // 添加对应视频剧集
    openVedioList (raw) {
      console.log(raw.id)
      this.videoForm.tvSeries = raw.id
      this.UpdatevediodialogVisible = true
    },
    // 搜索短剧
    async searchVideos () {
      // console.log('过滤后的视频列表:', this.title)
      const res = await GetSearch(this.title)
      console.log('过滤后的视频列表:', res)
      this.videos = res
    },
    // 切换分页
    handlePageChange (page) {
      this.currentPage = page
      this.GetVedioList()
    },
    // 删除视频封面
    async deleteVideo (video) {
      this.$confirm('确定要删除视频吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // console.log(raw.id)
        const res = await DelVedioList(video.id)
        // console.log(res)
        if (res !== true) {
          return this.$message.error('删除失败！请重新删除或联系管理人员')
        } else {
          this.GetVedioList()
          // 删除该行
          this.$message({ type: 'success', message: '删除成功!' })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCoverChange (file) {
      console.log(file.raw)

      this.currentVideoForm.icon = file.raw // 存储文件对象而不是文件名
    },
    beforeCoverUpload (file) {
      return true
    },

    async GetTypelist () {
      const res = await GetTypelist()
      console.log(res)
      this.typeslist = res
    },
    // 添加视频封面
    async addVideo () {
      if (!this.currentVideoForm.name || !this.currentVideoForm.icon || !this.currentVideoForm.desc || !this.currentVideoForm.type || !this.currentVideoForm.ftype) {
        this.$message.error('请填写所有字段！')
        return
      }
      // console.log(this.checkList)

      const formData = new FormData()
      formData.append('name', this.currentVideoForm.name)
      formData.append('icon', this.currentVideoForm.icon) // 确保这里的 icon 是一个 File 对象

      formData.append('desc', this.currentVideoForm.desc)
      formData.append('type', this.currentVideoForm.type)

      formData.append('ftype', this.currentVideoForm.ftype)
      formData.append('types', Array(this.checkList))

      console.log('FormData:', Array.from(formData.entries()))

      const res = await PostVedioList(formData)
      console.log(res)
      if (res.code !== 0) {
        return this.$message.error('视频列表上传失败')
      } else {
        this.dialogVisible = false
        this.$message.success('视频列表上传成功！！')
        this.GetVedioList()
      }
    },
    // 修改视频封面
    async updateVideo () {
      const formData = new FormData()
      formData.append('name', this.currentVideoForm.name)
      formData.append('icon', this.currentVideoForm.icon) // 确保这里的 icon 是一个 File 对象

      formData.append('desc', this.currentVideoForm.desc)
      formData.append('type', this.currentVideoForm.type)

      formData.append('ftype', this.currentVideoForm.ftype)
      formData.append('types', Array(this.checkList))
      console.log('FormData:', Array.from(formData.entries()))
      console.log('id', this.currentVideoForm.id)

      const res = await PutVedioList(formData, this.currentVideoForm.id)
      // console.log(res)
      if (res.code !== 0) {
        return this.$message.error('修改失败！！')
      } else {
        this.UpdatedialogVisible = false
        this.$message.success('修改成功！！')
        this.GetVedioList()
      }
    },
    // 获取对应视频下的视频剧集
    SelVediolists (raw) {
      // console.log(raw.id)
      this.SelVedioId = raw.id
      this.SelVediodetail()
      this.SeldialogVisible = true
    },
    // 查看视频详情剧集
    async SelVediodetail () {
      const res = await SelVediodetail(Number(this.SelVedioId))
      console.log(res)
      this.episodesList = res
    },
    // 删除视频详情对应剧集
    handleDelete (raw) {
      this.$confirm('确定要删除该剧集吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // console.log(raw.id)
        const res = await DelVediodetail(raw.id)
        // console.log(res)
        if (res.code !== 200) {
          return this.$message.error('删除失败！请重新删除或联系管理人员')
        } else {
          this.SelVediodetail()
          // 删除该行
          this.$message({ type: 'success', message: '删除成功!' })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    //
    handleVideoChange2 (file) {
      this.videoForm.videoUrl = file.raw // 显示视频文件名称
      this.videoForm.title = file.name
    },
    beforeVideoUpload2 (file) {
      // 在此处可以添加文件类型或大小的限制
      return true
    },
    handleCoverChange2 (file) {
      this.videoForm.coverUrl = file.name // 显示封面文件名称
    },
    beforeCoverUpload2 (file) {
      // 在此处可以添加文件类型或大小的限制
      return true
    },
    async submitForm () {
      this.$refs.videoFormRef.validate(async (valid) => {
        if (valid) {
          // 在此处处理表单提交逻辑
          // console.log('视频信息:', this.videoForm)
          // const StName = '第' + this.videoForm.episodeCount + '集'
          const formData = new FormData()
          formData.append('vid', Number(this.videoForm.tvSeries))
          formData.append('st', Number(this.videoForm.episodeCount))
          formData.append('astrict', this.videoForm.astrict)
          formData.append('file', this.videoForm.videoUrl)
          console.log('FormData:', Array.from(formData.entries()))
          const res = await PostAddVedio(formData)
          console.log(res)
          if (res.code !== 200) {
            return this.$message.error('视频剧集添加失败！！！')
          } else {
            this.$message.success('视频剧集添加成功！')
            this.UpdatevediodialogVisible = false
            this.videoForm = {
              title: '',
              videoUrl: '',
              coverUrl: '',
              description: '',
              status: '',
              duration: '',
              episodeCount: 1,
              tvSeries: '', // 新增字段，表示所属电视剧
              astrict: false
            }
          }
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    }
  }
}
</script>

<style>
.upload-demo {
  margin-top: 10px;
}
</style>
