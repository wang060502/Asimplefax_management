import request from '@/utils/request.js'

// 账号登陆
export const GetLogin = (username, pwd) => {
  return request.post('/user/login', {
    username, pwd
  })
}

// 获取用户列表
export const GetUserList = (pn) => {
  return request.get('/user/list', {
    params: {
      ps: 5,
      pn
    }
  })
}

// 删除用户
export const DelUserList = (id) => {
  return request.delete('/user/del', {
    params: {
      id
    }
  })
}

// 管理员添加账户
export const PostUserList = (username, password, email, telephone) => {
  return request.post('/user/add', {
    username, password, email, telephone
  })
}
