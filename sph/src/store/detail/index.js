import { reqDetailInfo, addOrUpdateShopCar } from '@/api'
import { getUUID } from '@/utils/uuid_token'
// 仓库中的数据
const state = {
  // 商品信息
  goodInfo: {},
  // 游客信息
  uuid_token: getUUID()
}
// mutations代表维护，操作维护的是state中的数据，state中的数据只能由mutations修改
const mutations = {
  GETDETAILINFO(state, goodInfo) {
    state.goodInfo = goodInfo
  }
}
// actions代表一系列动作，可以进行一系列逻辑，和异步操作
const actions = {
  async getDetailInfo({ commit }, skuId) {
    let { data: res } = await reqDetailInfo(skuId)
    console.log(res, 'getDetailInfo');
    if (res.code == 200) {
      commit('GETDETAILINFO', res.data)
    }
  },
  //加入购物车的||修改某一个产品的个数，注意一定要用解构方法解构形参对象，不能写成接收两个形参形式，那样会报错接口调不通
  async addOrUpdateShopCar({ commit }, { skuId, skuNum }) {
    //发请求:前端带一些参数给服务器【需要存储这些数据】，存储成功了，没有给返回数据
    //不需要在三连环（仓库存储数据了）
    //注意:async函数执行返回的结果一定是一个promise【要么成功，要么失败】
    let { data: res } = await addOrUpdateShopCar(skuId, skuNum);
    console.log('response', res);
    if (res.code == 200) {
      //返回的是成功的标记
      return "OK";
    } else {
      //返回的是失败的标记
      return Promise.reject(new Error("fail"))
    }
  },
}
// getters代表计算属性，可以简化仓库数据，让组件获取仓库数据更方便
const getters = {
  skuInfo() {
    return state.goodInfo.skuInfo || {}
  },
  spuSaleAttrList() {
    return state.goodInfo.spuSaleAttrList || []
  },
  categoryView() {
    return state.goodInfo.categoryView || {}
  }
}
export default {
  state, getters, mutations, actions
}