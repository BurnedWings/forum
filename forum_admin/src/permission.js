import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async (to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)
//   const ret = await store.dispatch('user/getInfo')
//     console.log(ret)
//     next()
//   // determine whether the user has logged in
//   // const hasToken = getToken()
//   // const hasToken = store.state.user.name
//   // if (hasToken) {
//   //   if (to.path === '/login') {
//   //     // if is logged in, redirect to the home page
//   //     next({ path: '/' })
//   //     NProgress.done()
//   //   } else {
//   //     const hasGetUserInfo = store.getters.name
//   //     if (hasGetUserInfo) {
//   //       next()
//   //     } else {

//   //       try {
//   //         // get user info
//   //         await store.dispatch('user/getInfo')
//   //         next()
//   //       } catch (error) {
//   //         // remove token and go to login page to re-login
//   //         await store.dispatch('user/resetToken')
//   //         Message.error(error || 'Has Error')
//   //         next(`/login?redirect=${to.path}`)
//   //         NProgress.done()
//   //       }
//   //     }
//   //   }
//   // } else {
//   //   /* has no token*/

//   //   if (whiteList.indexOf(to.path) !== -1) {
//   //     // in the free login whitelist, go directly
//   //     next()
//   //   } else {
//   //     // other pages that do not have permission to access are redirected to the login page.
//   //     next(`/login?redirect=${to.path}`)
//   //     NProgress.done()
//   //   }
//   // }
// })

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // if(store.state.user.name!=''){
  //    next({path:'/'})
  //    return
  // }
  let token = localStorage.kumicho_dev_access_token
  if (token) {
    //如果有就直接继续
    await store.dispatch("user/getInfo");
    if(to.path==='/login'){
      next('/')
    }else{
      next()
    }
  } else {
    if (to.path === '/login') {
      //如果是登录页面,就停留登录页,不在重复跳转
      next();
    } else {
      next('/login');
    }
  }
  
  const toPath = to.path
  if (toPath.indexOf('/user') != -1 ) {
    if (store.state.user.permissionsList.includes(1)||store.state.user.permissionsList.includes(0)) {
      return next()
    }else{
      return next(`${from.path}`)
    }
  }

  if (toPath.indexOf('/article') != -1 ) {
    if (store.state.user.permissionsList.includes(2)||store.state.user.permissionsList.includes(0)) {
      return next()
    }else{
      return next(`${from.path}`)
    }
  }

  if (toPath.indexOf('/trend') != -1 ) {
    if (store.state.user.permissionsList.includes(3)||store.state.user.permissionsList.includes(0)) {
      return next()
    }else{
      return next(`${from.path}`)
    }
  }

  if (toPath.indexOf('/system') != -1 ) {
    if (store.state.user.permissionsList.includes(4)||store.state.user.permissionsList.includes(0)) {
      return next()
    }else{
      return next(`${from.path}`)
    }
  }

  if (toPath.indexOf('/permissions') != -1 ) {
    if (store.state.user.permissionsList.includes(0)) {
      return next()
    }else{
      return next(`${from.path}`)
    }
  }



  // if (store.state.user.name != '') {
  //   next()
  // }else {

  // }

  // if(localStorage.kumicho_dev_access_token){
  //   next()
  // }else{
  //   next({path:'/login'})
  // }



  // if (hasToken) {
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     const hasGetUserInfo = store.getters.name
  //     if (hasGetUserInfo) {
  //       next()
  //     } else {
  //       try {
  //         // get user info
  //         await store.dispatch('user/getInfo')

  //         next()
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/

  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
