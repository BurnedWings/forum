import requests from "@/utils/request";

//上传轮播图
export const uploadSwiper = (fromData) => requests({url:'/admin/uploadSwiper',method:'post',data:fromData})

//查询轮播图
export const getSwiper = () => requests({url:'/admin/getSwiper',method:'get'})

//添加轮播图描述
export const updateSwiperDescription = (swiperId,description) => requests({url:'/admin/updateSwiperDescription',method:'post',data:{swiperId,description}})

//移除轮播图
export const removeSwiper = (swiperId) => requests({url:'/admin/removeSwiper',method:'post',data:{swiperId}})

//获取未推荐文章
export const getNotRecommendArticle = (offset) => requests({url:'/admin/getNotRecommendArticle',method:'post',data:{offset}})

//推荐文章
export const recommendTheArticle = (articleId) => requests({url:'/admin/recommendTheArticle',method:'post',data:{articleId}})

//获取推荐文章
export const getRecommendArticle = (offset) => requests({url:'/admin/getRecommendArticle',method:'post',data:{offset}})

//取消文章推荐
export const cancelArticleRecommend = (articleId) => requests({url:'/admin/cancelArticleRecommend',method:'post',data:{articleId}})