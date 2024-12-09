<template>
  <div class="analytics">
    <el-card>
      <div class="charts-container">
        <!-- 注册用户图表 -->
        <div id="registerChart" class="chart"></div>
        <!-- 在线用户图表 -->
        <div id="onlineChart" class="chart"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { SeluserNumber, SelKeepalive } from '@/api/login/login'

export default {
  data () {
    return {
      registerCount: 0, // 注册用户数量
      onlineCount: 0 // 在线用户数量
    }
  },
  methods: {
    // 初始化图表
    initCharts () {
      // 注册用户图表（柱状图）
      const registerChart = echarts.init(document.getElementById('registerChart'))
      const registerOption = {
        title: {
          text: '注册用户数量',
          left: 'center'
        },
        tooltip: {
          formatter: '注册用户: {c}'
        },
        xAxis: {
          type: 'category',
          data: ['注册用户']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            data: [this.registerCount],
            itemStyle: {
              color: '#5470C6'
            }
          }
        ]
      }
      registerChart.setOption(registerOption)

      // 在线用户图表（仪表盘）
      const onlineChart = echarts.init(document.getElementById('onlineChart'))
      const onlineOption = {
        title: {
          text: '在线用户数量',
          left: 'center'
        },
        tooltip: {
          formatter: '在线用户: {c}'
        },
        series: [
          {
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 10,
                color: [
                  [0.3, '#4a90e2'],
                  [0.7, '#7b61ff'],
                  [1, 'rgb(86, 114, 202)']
                ] // 渐变颜色
              }
            },
            pointer: {
              width: 5
            },
            detail: { formatter: '{value}' },
            data: [{ value: this.onlineCount, name: '用户' }]
          }
        ]
      }
      onlineChart.setOption(onlineOption)

      // 保存图表实例
      this.registerChart = registerChart
      this.onlineChart = onlineChart
    },

    // 更新图表数据
    updateCharts () {
      if (this.registerChart && this.onlineChart) {
        // 更新注册用户图表数据
        this.registerChart.setOption({
          series: [
            {
              data: [this.registerCount]
            }
          ]
        })

        // 更新在线用户图表数据
        this.onlineChart.setOption({
          series: [
            {
              data: [{ value: this.onlineCount, name: '用户' }]
            }
          ]
        })
      }
    },

    // 调用 API 获取最新数据
    async fetchData () {
      try {
        // 获取注册用户数量
        const registerRes = await SeluserNumber()
        this.registerCount = registerRes || 0 // 如果返回数据异常，默认为 0

        // 获取在线用户数量
        const onlineRes = await SelKeepalive()
        this.onlineCount = onlineRes || 0 // 如果返回数据异常，默认为 0

        // 更新图表
        this.updateCharts()
      } catch (error) {
        console.error('数据获取失败:', error)
      }
    }
  },
  mounted () {
    this.initCharts()
    this.fetchData() // 初始化时获取数据

    // 每分钟轮询一次
    this.timer = setInterval(this.fetchData, 60000)
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.timer)
    if (this.registerChart) this.registerChart.dispose()
    if (this.onlineChart) this.onlineChart.dispose()
  }
}
</script>

<style scoped>
.analytics {
  padding: 20px;
}

.charts-container {
  display: flex;
  justify-content: space-between; /* 左右排列，图表之间留有空隙 */
  align-items: flex-start; /* 图表顶部对齐 */
  flex-wrap: wrap; /* 如果屏幕宽度不足，图表会自动换行 */
}

.chart {
  width: 48%; /* 每个图表占 48% 的宽度，留出 4% 的间隔 */
  height: 300px;
  border: 1px solid #f0f0f0; /* 添加边框区分图表 */
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
  background-color: #fff; /* 背景色为白色 */
}
</style>
