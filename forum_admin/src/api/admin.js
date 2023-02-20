import requests from "@/utils/request";

//添加管理员
export const createAdmin = (admin) => requests({url:'/admin/createAdmin',method:'post',data:{admin}})

//设置管理员头像
export const setAdminImage = (fromData) => requests({url:'/admin/setAdminImage',method:'post',data:fromData})

//查询所有管理员信息
export const getOtherAdmin = () => requests({url:'/admin/getOtherAdmin',method:'get'})

//更新管理员
export const updateTheAdmin = (admin) => requests({url:'/admin/updateTheAdmin',method:'post',data:{admin}})