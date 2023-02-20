import requests from "@/utils/request";

//获取待审核动态
export const getNotAuditTrend = (offset) => requests({url:'/admin/getNotAuditTrend',method:'post',data:{offset}})

//通过动态审核
export const auditTheTrend = (trendId) => requests({url:'/admin/auditTheTrend',method:'post',data:{trendId}})

//锁定文章
export const lockTheTrend = (trendId,message) => requests({url:'/admin/lockTheTrend',method:'post',data:{trendId,message}})

//获取已过审动态
export const getAuditTrend = (offset) => requests({url:'/admin/getAuditTrend',method:'post',data:{offset}})

//获取动态举报信息
export const getTrendReportMessage = (offset) => requests({url:'/admin/getTrendReportMessage',method:'post',data:{offset}})

//获取单条动态详情
export const getCurrentTrend = (trendId) => requests({url:'/admin/getCurrentTrend',method:'post',data:{trendId}})

//完成动态举报任务
export const finishTrendReportTask = (trendReportId) => requests({url:'/admin/finishTrendReportTask',method:'post',data:{trendReportId}})

//获取动态评论举报信息
export const getTrendCommentReportMessage = (offset) => requests({url:'/admin/getTrendCommentReportMessage',method:'post',data:{offset}})

//完成动态评论举报任务
export const finishTrendCommentReport = (taskId) => requests({url:'/admin/finishTrendCommentReport',method:'post',data:{taskId}})

//删除动态评论
export const deleteTrendComment = (comment,trend) => requests({url:'/admin/deleteTrendComment',method:'post',data:{comment,trend}})

//删除动态回复
export const deleteTrendReply = (reply) => requests({url:'/admin/deleteTrendReply',method:'post',data:{reply}})