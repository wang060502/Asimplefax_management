import request from '@/utils/request.js'

// 添加轮播图
export const PostBaner = (formData) => {
  return request.post('/api/carousel', formData)
}

// 获取轮播图1
export const GetBannerList = () => {
  return request.get('/api/carousel')
}

// 删除轮播图列表
export const DelBannerList = (id) => {
  return request.delete('/api/carousel', { params: { id } })
}

// 修改轮播图列表
export const ChangeBaneerList = (formData) => {
  return request.put('/api/carousel', formData)
}

// 添加首页推荐列表
export const Putreclist = (ids) => {
  const idParams = ids.map(id => `id=${id}`).join('&')
  return request.put(`/api/tags?${idParams}&tag=rec`)
}

// 删除首页推荐列表
export const Delreclist = (ids) => {
  const idParams = ids.map(id => `id=${id}`).join('&')
  return request.delete(`/api/tags?${idParams}&tag=rec`)
}

// 获取首页推荐列表数据
export const Getreclist = () => {
  return request.get('/api/tags', {
    params: {
      tag: 'rec'
    }
  })
}

// 添加热门推荐列表
export const Puthotlist = (ids) => {
  const idParams = ids.map(id => `id=${id}`).join('&')
  return request.put(`/api/tags?${idParams}&tag=hot`)
}

// 删除热门推荐列表
export const Delhotlist = (ids) => {
  const idParams = ids.map(id => `id=${id}`).join('&')
  return request.delete(`/api/tags?${idParams}&tag=hot`)
}

// 获取热门推荐列表数据
export const Gethotlist = () => {
  return request.get('/api/tags', {
    params: {
      tag: 'hot'
    }
  })
}

// 添加最新推荐列表
export const Putnewlist = (ids) => {
  const idParams = ids.map(id => `id=${id}`).join('&')
  return request.put(`/api/tags?${idParams}&tag=new`)
}

// 删除热门推荐列表
export const Delnewlist = (ids) => {
  const idParams = ids.map(id => `id=${id}`).join('&')
  return request.delete(`/api/tags?${idParams}&tag=new`)
}

// 获取最新列表数据
export const Getnewlist = () => {
  return request.get('/api/tags', {
    params: {
      tag: 'new'
    }
  })
}

// 获取搜索列表
export const GetSearch = (keyword) => {
  return request.get('/api/videos/search', {
    params: {
      keyword
    }
  })
}
