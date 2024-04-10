import { registerUser, reqGetCode, reqLogin, reqUserInfo, reqLogout } from '@/api'
import { getToken, setToken, removeToken } from "@/utils/token";
const state = {
  code: '',
  token: getToken(),
  userInfo: {}
}
const mutations = {
  GETCODE(state, code) {
    state.code = code
  },
  GETUSERINFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  LOGINUSER(state, token) {
    state.token = token
  },
  //清除本地数据
  USERLOGOUT(state) {
    //帮仓库中相关用户信息清空
    state.token = '';
    state.userInfo = {};
    //本地存储数据清空
    removeToken();
  },
}
const actions = {
  async getCode({ commit }, phone) {
    let { data: res } = await reqGetCode(phone)
    console.log('code', res);
    if (res.code == 200) {
      commit('GETCODE', res.data)
    }
  },
  //用户注册
  async registerUser({ commit }, data) {
    let res = await registerUser(data);
    console.log("******注册用户-response:{}", res);
    if (res.data.code == 1) {
      //返回的是成功的标记
      return "OK";
    } else {
      //返回的是失败的标记
      return Promise.reject(new Error("fail"))
    }
  },
  // 用户登录
  async loginUser({ commit }, { password, phone }) {
    let { data: res } = await reqLogin({ password, phone })
    console.log('login', res);
    if (res.code == 200) {
      setToken(res.data.token);
      commit('LOGINUSER', res.data.token)
      console.log('登陆成功');

    } else {
      //返回的是失败的标记
      return Promise.reject(new Error("fail"))
    }
  },
  // 获取用户信息
  async getUserInfo({ commit }) {
    let { data: res } = await reqUserInfo();
    console.log('getUserInfo', res);
    if (res.code == 200) {
      commit('GETUSERINFO', res.data);
      console.log('提交成功', res.data);
    }
  },
  // 用户退出
  async logout({ commit }) {
    //只是向服务器发起一次请求，通知服务器清除token
    let { data: response } = await reqLogout();
    console.log("******用户退出-response:{}", response);
    //服务器下发token，用户唯一标识符(uuid)
    //将来经常通过带token找服务器要用户信息进行展示
    if (response.code == 200) {
      //用户已经登录成功且获取到token
      commit('USERLOGOUT');
      //返回的是成功的标记
      return "OK";
    } else {
      //返回的是失败的标记
      return Promise.reject(new Error(response.message))
    }
  },

}
const getters = {}
export default {
  state, mutations, actions, getters
}