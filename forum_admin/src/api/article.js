import request from '@/utils/request'

//获取未审核文章
export const getNotAuditArticle = (offset) => request({url:'/admin/getNotAuditArticle',method:'post',data:{offset}})

//审核通过
export const auditTheArticle = (articleId) => request({url:'/admin/auditTheArticle',method:'post',data:{articleId}})

//文章状态通知
export const articleStatusMessage = (message) => request({url:'/admin/articleStatusMessage',method:'post',data:{message}})

//获取已经审核文章
export const getAuditArticle = (offset) => request({url:'/admin/getAuditArticle',method:'post',data:{offset}})

//查询已退回文章
export const getBackArticle = (offset) => request({url:'/admin/getBackArticle',method:'post',data:{offset}})

//退回文章
export const backTheArticle = (articleId) => request({url:'/admin/backTheArticle',method:'post',data:{articleId}})

//添加文章类型
export const createArticleType = (type) => request({url:'/admin/createArticleType',method:'post',data:{type}})

//获取文章相关举报信息
export const getArticleReportMessage = (offset) => request({url:'/admin/getArticleReportMessage',method:'post',data:{offset}})

//获取单条文章信息
export const getCurrentArticle = (articleId) => request({url:`/admin/getCurrentArticle/${articleId}`,method:'get'})

//完成文章举报任务
export const finishArticleReport = (articleReportId) => request({url:'/admin/finishArticleReport',method:'post',data:{articleReportId}})

//获取文章评论举报任务
export const getArticleCommentReport = (offset) => request({url:'/admin/getArticleCommentReport',method:'post',data:{offset}})

//完成文章评论举报任务
export const finishTheArticleCommentTask = (taskId) => request({url:'/admin/finishTheArticleCommentTask',method:'post',data:{taskId}})

//删除评论
export const deleteReportComment = (taskId,comment,article) => request({url:'/admin/deleteReportComment',method:'post',data:{taskId,comment,article}})

//删除回复
export const deleteReportReply = (reply,taskId) => request({url:'/admin/deleteReportReply',method:'post',data:{reply,taskId}})




