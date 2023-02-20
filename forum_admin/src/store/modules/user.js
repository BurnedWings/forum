import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { MessageBox, Message } from 'element-ui'
import router from "@/router";
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    localStorage.removeItem('kumicho_dev_access_token')
    localStorage.removeItem('kumicho_dev_refresh_token')
    state.name = ''
    state.avatar = ''
    state._id = ''
    state.token = ''
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ID: (state, id) => {
    state._id = id
  },
  MARKARTICLETASK: (state, articleTask) => {
    state.articleTask = articleTask
  },
  MARKTRENDTASK: (state, trendTask) => {
    state.trendTask = trendTask
  },
  SET_PERMISSIONS(state,permissionsList){
    state.permissionsList = permissionsList
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if (response.code === 200) {
          const { data } = response
          // setToken(data.token)
          localStorage.setItem("kumicho_dev_access_token", data.token);
          localStorage.setItem('kumicho_dev_refresh_token', data.refToken)
          resolve()
        } else if (response.code === 202) {
          Message({
            type: 'error',
            message: response.message
          })
          reject()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  //get user info
  getInfo({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      const ret = await getInfo(localStorage.kumicho_dev_access_token)
      if (ret.code === 200) {
        const data = ret.data
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        resolve()
        const { username, image, _id,permissionsList } = data
        commit('SET_NAME', username)
        commit('SET_AVATAR', image)
        commit('SET_ID', _id)
        commit('SET_PERMISSIONS',permissionsList)
      }
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('RESET_STATE')
      resolve()
    })
  },

  // // remove token
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     removeToken() // must remove  token  first
  //     commit('RESET_STATE')
  //     resolve()
  //   })
  // },
  markArticleTask(context, articleTask) {
    context.commit('MARKARTICLETASK', articleTask)
  },
  markTrendTask(context, trendTask) {
    context.commit('MARKTRENDTASK', trendTask)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

