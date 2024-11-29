import request from '@/utils/request.js'

// 添加博客
export const Putarticle = (formData) => {
  return request.post('/api/article', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 获取博客列表
export const GetarticleList = (pn) => {
  return request.get('/api/article/list', {
    params: {
      pn,
      ps: 5
    }
  })
}

// 上传图片
export const getuploadfile = (formData) => {
  return request.post('/api/article/uploadimg', formData, {
    headers: {
      'Content-Type': 'multipart/form-data' // 确保内容类型为 multipart/form-data
    }
  })
}

// 删除博客
export const DelBlogList = (id) => {
  return request.delete('/api/article', {
    params: {
      id
    }
  })
}

// 获取文章详情
export const getblogdetail = (id) => {
  return request.get('/api/article/get', {
    params: {
      id
    }
  })
}

// 修改文章详情
export const Putbloglist = (formData) => {
  return request.put('/api/article', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
