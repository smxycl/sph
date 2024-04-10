import { reqGetCartList, reqDeleteCartById, reqUpdateCheckedById } from '@/api'
const state = {
  // 购物车列表
  cartList: []
}
// mutations代表操作维护，对仓库中的数据进行操作维护，并且state中的数据只能在mutations中修改
const mutations = {
  GETCARTLIST(state, cartList) {
    state.cartList = cartList
  }
}
// actions代表一系列动作，可以在里面书写自己的业务逻辑，也可以在里面写异步操作
const actions = {
  // 的到购物车数据
  async getCartList({ commit }) {
    let { data: res } = await reqGetCartList()
    if (res.code == 200) {
      commit('GETCARTLIST', res.data)
    }
  },
  // 删除购物车某个产品
  async deleteCartById({ commit }, skuId) {
    let { data: res } = await reqDeleteCartById(skuId)
    if (res.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('fail'))
    }
  },
  // 通过Id修改产品状态，即是否被选中
  async updateCheckedById({ commit }, { skuId, isChecked }) {
    let { data: res } = await reqUpdateCheckedById(skuId, isChecked)
    console.log(res);
    if (res.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('fail'))
    }
  },
  // 删除全部被选中的产品
  async deleteAllChecked({ getters, dispatch }) {
    let PromiseAll = []
    getters.cartList.cartInfoList.forEach(item => {
      let Promise = item.isChecked == 1 ? dispatch('deleteCartById', item.skuId) : ''
      PromiseAll.push[Promise]
    });
    return Promise.all(PromiseAll)
  },
  //修改全部产品的状态
  async updateAllCheckedCar({ dispatch, getters }, isChecked) {
    //context:小仓库，commit【提交mutations修改state】 getters【计算属性】 dispatch【派发action】 state【当前仓库数据】
    //获取购物车中全部的产品（是一个数组）
    let primoseAll = [];
    getters.cartList.cartInfoList.forEach(item => {
      let promise = dispatch('updateCheckedById', { skuId: item.skuId, isChecked });
      //将每一次返回的Promise添加到数组当中
      primoseAll.push(promise);
    })
    //只要全部的p1|p2....都成功，返回结果即为成功
    //如果有一个失败，返回即为失败结果
    return Promise.all(primoseAll);
  }
}
// getters简化数据，可以让组件获取数据更方便
const getters = {
  cartList() {
    return state.cartList[0] || []
  },

}
export default {
  state, getters, mutations, actions
}