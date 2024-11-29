<template>
  <div class="videoadd">
    <el-card>
      <h2>视频添加</h2>
      <el-form :model="videoForm" ref="videoFormRef" :rules="rules">
        <!-- <el-form-item label="视频名称" prop="title" required>
          <el-input v-model="videoForm.title" placeholder="请输入视频名称"></el-input>
        </el-form-item> -->

        <el-form-item label="上传视频" prop="videoUrl" required>
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :on-change="handleVideoChange"
            :before-upload="beforeVideoUpload"
            :show-file-list="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">拖拽视频到此处，或<em>点击上传</em></div>
          </el-upload>
          <el-input v-model="videoForm.title" placeholder="上传后会显示视频链接" disabled></el-input>
        </el-form-item>

        <el-form-item label="所属电视剧" prop="tvSeries" required>
          <el-select v-model="videoForm.tvSeries" placeholder="选择所属电视剧">
            <el-option v-for="series in tvSeriesList" :key="series.id" :label="series.name" :value="series.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上传剧集" prop="episodeCount" required>
          <el-input-number
            v-model="videoForm.episodeCount"
            :min="1"
            :max="100"
            label="剧集数量"
            style="width: 10%"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="VIP剧集" prop="delivery">
          <el-switch v-model="videoForm.astrict"></el-switch>
        </el-form-item>

        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { GetVedioList, PostAddVedio } from '@/api/vedio/vedio'
export default {
  name: 'videoaddIndex',
  data () {
    return {
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
        tvSeries: [
          { required: true, message: '请选择所属电视剧', trigger: 'change' }
        ],
        episodeCount: [
          { required: true, message: '请输入剧集数量', trigger: 'blur' },
          { type: 'number', min: 1, max: 100, message: '剧集数量必须在 1 到 100 之间', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.GetVedioList()
  },
  methods: {
    // 获取视频列表
    async GetVedioList () {
      const res = await GetVedioList()
      console.log(res)

      this.tvSeriesList = res.records
    },
    handleVideoChange (file) {
      this.videoForm.videoUrl = file.raw // 显示视频文件名称
      this.videoForm.title = file.name
    },
    beforeVideoUpload (file) {
      // 在此处可以添加文件类型或大小的限制
      return true
    },
    handleCoverChange (file) {
      this.videoForm.coverUrl = file.name // 显示封面文件名称
    },
    beforeCoverUpload (file) {
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
          this.$message.success('视频信息提交成功！')
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
