import { reqCategoryList, reqBannersList, reqFloorsList } from '@/api'
//state代表仓库中的数据
const state = {
  categoryList: [],
  // 轮播图数据
  bannerList: [],
  floorList: []
}
//mutations代表维护，操作维护的是state中的数据，且state中数据只能在mutations中处理
const mutations = {
  GETCATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList
  },
  GETBANNERSLIST(state, bannerList) {
    state.bannerList = bannerList
  },
  GETFLOORSLIST(state, floorList) {
    state.floorList = floorList
  }
}
//actions代表一系列动作，可以书写自己的业务逻辑，也可以处理异步
const actions = {
  // 得到三级联动目录的数据方法
  async getCategoryList({ commit }) {
    const { data: res } = await reqCategoryList()
    if (res.code == 200) {
      commit('GETCATEGORYLIST', res.data)
    }
  },
  // 得到banners的数据
  async getBannersList({ commit }) {
    let { data: res } = await reqBannersList()
    console.log(res, 'Banners');
    if (res.code == 200) {
      commit('GETBANNERSLIST', res.data)
    }
  },
  // 得到floors的数据
  async getFloorsList({ commit }) {
    let { data: res } = await reqFloorsList()
    console.log(res, 'floors');
    if (res.code == 200) {
      commit('GETFLOORSLIST', res.data)
    }
  }
}
//getters理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {}
export default ({
  state, actions, mutations, getters
})