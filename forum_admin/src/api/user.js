import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/adminLogin',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/admin/getAdminInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

//获取用户列表
export const getUserInfoList = (offset, status) => request({ url: `/admin/getUserInfoList`, method: 'post', data: { offset, status } })

//禁言用户
export const forbidTheUser = (user) => request({ url: '/admin/forbidTheUser', method: 'post', data: { user } })

//解除用户禁言
export const cancelForbidTheUser = (user) => request({ url: '/admin/cancelForbidTheUser', method: 'post', data: { user } })

//全部禁言
export const forbidAllUser = () => request({ url: '/admin/forbidAllUser', method: 'get' })

//取消全部禁言
export const cancelForbidAllUser = () => request({ url: '/admin/cancelForbidAllUser', method: 'get' })

//处理公告图片
export const handleNoticeImg = (formData) => request({url:'/admin/handleNoticeImg',method:'post',data:formData})

//推送公告
export const createNotice = (notice) => request({url:'/admin/createNotice',method:'post',data:{notice}})

//获取单个用户数据
export const getOneUserInfo = (userId) => request({url:`/admin/getOneUserInfo/${userId}`,method:'get'})
