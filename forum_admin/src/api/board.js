import request from '@/utils/request'

//大屏性别比例
export const getUserGenderInfo = () => request({url:'/admin/getUserGenderInfo',method:'get'})

//大屏文章统计
export const getTypeArticleCount = () => request({url:'/admin/getTypeArticleCount',method:'get'})

export const updateTheArticleType = (type) => request({url:'/admin/updateTheArticleType',method:'post',data:{type}})

//获取七天内评论数据
export const getWekCommentCount = () => request({url:'/admin/commentCountForWek',method:'get'})

//获取年龄分布
export const getAgeInfo = () => request({url:'/admin/getAgeInfo',method:'get'})

//获取新增用户
export const newUserWeek = () => request({url:'/admin/newUserWeek',method:'get'})

//任务
export const notFinishTask = () => request({url:'/admin/notFinishTask',method:'get'})