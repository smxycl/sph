import { reqSearchList } from '@/api'
// 代表仓库中的数据
const state = {
  searchList: {}
}
// mutations代表维护，操作维护的是mutations中的数据，state中的数据只能在mutations中处理
const mutations = {
  // Search页面的数据
  GETSEARCHLIST(state, searchList) {
    state.searchList = searchList
  }
}
// actions代表一系列动作，可以书写自己的业务逻辑，也可以写异步操作
const actions = {
  async getSearchList({ commit }, params = {}) {
    let { data: res } = await reqSearchList(params)
    console.log(res, 'search页面的数据');
    if (res.code == 200) {
      commit('GETSEARCHLIST', res.data)
    }
  }
}
// getters可以理解为计算属性，可以用来简化仓库数据，让组件获取仓库数据更加简便
const getters = {
  //注意：这个attrsList方法名必须和属性名goodsList一致才行，之前随便命名的getAttrsList()发现无法使用
  attrsList(state) {
    //state.searchList.goodsList如果服务器数据回来了，没问题是一个数组
    //假如网络不给力|没有网state.searchList是一个空数组，那么state.searchList.goodsList就是undefined
    //计算新的属性的属性值至少给人家来一个数组
    return state.searchList.attrsList || [];
  },
  goodsList(state) {
    return state.searchList.goodsList || [];
  },
  trademarkList(state) {
    return state.searchList.trademarkList || [];
  },
}
export default {
  state, mutations, actions, getters
}