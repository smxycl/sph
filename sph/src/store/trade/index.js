import { reqAddressInfo, reqOrderInfo } from "@/api";
//state代表仓库中的数据
const state = {
  addressInfo: [],
  orderInfo: {},
}
//mutations代表维护，操作维护的是state中的数据，且state中数据只能在mutations中处理
const mutations = {
  GETADDRESSINFO(state, addressInfo) {
    state.addressInfo = addressInfo
  },
  GETORDERINFO(state, orderInfo) {
    state.orderInfo = orderInfo
  },
}

//actions代表一系列动作，可以书写自己的业务逻辑，也可以处理异步
const actions = {
  //获取用户地址信息
  async getAddressInfo({ commit }) {
    let { data: res } = await reqAddressInfo();
    console.log("******获取用户地址信息-res:{}", res);
    if (res.code == 200) {
      commit('GETADDRESSINFO', res.data);
      //返回的是成功的标记
      return "OK";
    } else {
      //返回的是失败的标记
      return Promise.reject(new Error(res.message))
    }
  },
  //获取商品清单
  async getOrderInfo({ commit }) {
    let { data: res } = await reqOrderInfo();
    console.log("******获取商品清单-response:{}", res);
    if (res.code == 200) {
      commit('GETORDERINFO', res.data);
      //返回的是成功的标记
      return "OK";
    } else {
      //返回的是失败的标记
      return Promise.reject(new Error(res.message))
    }
  },
}

const getters = {

}

//创建并暴露store
export default {
  actions,
  mutations,
  state,
  getters
}
