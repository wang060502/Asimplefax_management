<template>
  <div class="PopularSkitsList">
    <el-card>
      <h2>热门短剧列表</h2>

      <el-button type="primary" @click="showSelectDialog">选择电视剧</el-button>

      <el-table :data="paginatedSkits" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="name" label="剧集名称" width="180"></el-table-column>
        <el-table-column label="图片" width="150">
          <template slot-scope="scope">
            <el-image :src="scope.row.icon" alt="剧集图片" style="width: 100%; height: auto;"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="剧集简介" width="300"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="deleteSkit(scope.row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="popularSkits.length"
        @current-change="handlePageChange"
        layout="total, prev, pager, next"
        style="margin-top: 20px;"
      ></el-pagination>

      <!-- 选择电视剧对话框 -->
      <el-dialog title="选择电视剧" :visible.sync="dialogVisible">
        <el-checkbox-group v-model="selectedTVShows">
          <el-checkbox
            v-for="show in tvShows"
            :key="show.id"
            :label="show.id"
          >{{ show.name }}</el-checkbox>
        </el-checkbox-group>

                <!-- 分页组件 -->
    <el-pagination
    :current-page.sync="numcurrentPage"
      layout="total,prev, pager, next"
      :total="totalTvshow"
      :page-size="numpageSize"
      @current-change="newhandlePageChange"
      class="pagination"
      style="text-align: center; margin-top: 20px;"
    ></el-pagination>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSelectedSkits">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { GetVedioList } from '@/api/vedio/vedio'
import { Puthotlist, Delhotlist, Gethotlist } from '@/api/home/home'
export default {
  name: 'PopularSkitsList',
  data () {
    return {
      dialogVisible: false,
      selectedTVShows: [],
      currentPage: 1,
      pageSize: 5,
      numpageSize: 5, // 每页显示的电视剧数量
      numcurrentPage: 1, // 当前页码
      totalTvshow: 0,
      tvShows: [
        { id: 1, title: '电视剧 A', description: '这是电视剧 A 的简介' },
        { id: 2, title: '电视剧 B', description: '这是电视剧 B 的简介' },
        { id: 3, title: '电视剧 C', description: '这是电视剧 C 的简介' }
        // 添加更多电视剧
      ],
      popularSkits: [],
      selectedIds: []
    }
  },
  computed: {
    paginatedSkits () {
      const start = (this.currentPage - 1) * this.pageSize
      return this.popularSkits.slice(start, start + this.pageSize)
    }
  },
  mounted () {
    this.GetVedioList()
    this.Gethotlist()
  },
  methods: {
    showSelectDialog () {
      this.dialogVisible = true
    },
    async GetVedioList () {
      const res = await GetVedioList(this.numcurrentPage)
      console.log(res)
      this.tvShows = res.records
      this.totalTvshow = res.total
    },
    newhandlePageChange (page) {
      console.log('新分页：', page)
      this.numcurrentPage = page
      this.GetVedioList()
    },
    // 获取短剧列表
    async Gethotlist () {
      const res = await Gethotlist()
      console.log(res)
      this.popularSkits = res
    },
    // 添加选择短剧
    async addSelectedSkits () {
      console.log('数组', this.selectedTVShows)
      const res = await Puthotlist(this.selectedTVShows)
      console.log(res)
      this.Gethotlist()
      this.dialogVisible = false
      this.selectedTVShows = [] // Reset selected shows
    },
    // 删除视频列表
    async deleteSkit (skit) {
      this.selectedIds.push(skit.id) // 将 id 添加到 selectedIds 数组
      console.log(this.selectedIds)
      const res = await Delhotlist(this.selectedIds)
      console.log('111', res)
      this.Gethotlist()
      this.$message.success('删除成功！！')
      this.selectedIds = []
    },
    handlePageChange (page) {
      this.currentPage = page
    }
  }
}
</script>

<style>
</style>
