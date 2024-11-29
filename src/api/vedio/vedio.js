import request from '@/utils/request'

// 获取视频列表
export const GetVedioList = (pn, ftype) => {
  return request.get('/api/videos', {
    params: {
      pn,
      ps: 5,
      ftype
    }
  })
}

// 新增视频列表
export const PostVedioList = (formData) => {
  return request.post('/api/videos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 修改视频列表
export const PutVedioList = (formData, id) => {
  return request.put('/api/videos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: {
      id
    }
  })
}

// 删除视频列表
export const DelVedioList = (id) => {
  return request.delete('/api/videos', { params: { id } })
}

// 对应视频剧集添加
export const PostAddVedio = (formData) => {
  return request.post('/api/video/offer', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 查看视频详情列表
export const SelVediodetail = (vid) => {
  return request.get('/api/video/list', {
    params: {
      vid
    }
  })
}

// 删除视频详情对应列表
export const DelVediodetail = (id) => {
  return request.get('/api/video/del', { params: { id } })
}

// 获取视频分类标签
export const GetTypelist = () => {
  return request.get('/api/types')
}
