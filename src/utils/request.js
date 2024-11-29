import axios from 'axios'
import { Loading } from 'element-ui' // 导入 Element UI 的 Loading 服务
// import store from '@/store' // 导入 Vuex store
import router from '@/router' // 导入 Vue Router
import Cookies from 'js-cookie'

const instance = axios.create({
  baseURL: '/api', // 设置 baseURL，根据实际情况修改
  timeout: 7000 // 设置请求超时时间
})

// 存储 Loading 实例
let loadingInstance = null

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前显示 loading
    loadingInstance = Loading.service({
      text: 'Loading...',
      fullscreen: true,
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 从 Vuex store 中获取 token
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `${token}`
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    if (loadingInstance) loadingInstance.close()
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 在接收响应后关闭 loading
    if (loadingInstance) loadingInstance.close()
    return response.data
  },
  function (error) {
    // 对响应错误做些什么
    if (loadingInstance) loadingInstance.close()

    // 检查错误状态码
    if (error.response && error.response.status === 403) {
      // 401 Unauthorized 错误，跳转到登录页
      router.push('/login')
    }

    return Promise.reject(error)
  }
)

export default instance
