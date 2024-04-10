import requests from './request'
import mockAjax from './mock'
/**
 * 请求得到三级联动组件目录
 * @returns Promise对象
 */
export const reqCategoryList = () =>
  requests({
    url: '/product/getBaseCategoryList',
    method: 'get'
  })
// 得到Banners的模拟数据
export const reqBannersList = () => {
  return mockAjax({
    url: '/banners',
    method: 'get'
  })
}
// 得到floors的模拟数据
export const reqFloorsList = () => {
  return mockAjax({
    url: '/floors',
    method: 'get'
  })
}
// 得到搜索页面的数据
export const reqSearchList = (data) => {
  return requests({
    url: '/list',
    method: 'post',
    data
  })
}
// 得到搜索详情页面的数据
export const reqDetailInfo = (skuId) => {
  return requests({
    url: `/item/${skuId}`,
    method: 'get',
  })
}
//将产品添加到购物车中（获取更新某一个产品的个数）
export const addOrUpdateShopCar = (skuId, skuNum) =>
  requests({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method: "post"
  });

// 获取购物车列表
export const reqGetCartList = () => {
  return requests({
    url: '/cart/cartList',
    method: 'get'
  })
}
// 删除购物车内商品
export const reqDeleteCartById = (skuId) => {
  return requests({
    url: `/cart/deleteCart/${skuId}`,
    method: 'delete'
  })
}
// 修改某个产品状态
export const reqUpdateCheckedById = (skuID, isChecked) =>
  requests({
    url: `/cart/checkCart/${skuID}/${isChecked}`,
    method: 'get'
  })
// 获取验证码
export const reqGetCode = (phone) => {
  return requests({
    url: `/user/passport/sendCode/${phone}`,
    method: 'get',

  })
}
// 注册用户
export const registerUser = (params) =>
  requests({ url: `/user/passport/register`, method: 'post', data: params })
// 用户登录
export const reqLogin = (data) => {
  return requests({
    url: '/user/passport/login',
    method: 'post',
    data
  })
}
//获取用户信息【需要带着用户的token向服务器要用户信息】
export const reqUserInfo = () =>
  requests({
    url: '/user/passport/auth/getUserInfo',
    method: 'get'
  });
// 退出登录
export const reqLogout = () =>
  requests({
    url: '/user/passport/logout',
    method: 'get'
  });
//获取用户地址信息
//URL:/api/user/userAddress/auth/findUserAddressList  method:get
export const reqAddressInfo = () =>
  requests({
    url: '/user/userAddress/auth/findUserAddressList',
    method: 'get'
  });
//获取商品清单
//URL:/api/order/auth/trade   method:get
export const reqOrderInfo = () =>
  requests({
    url: '/order/auth/trade',
    method: 'get'
  });
export const reqSubmitInfo = (tradeNo) =>
  requests({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    method: 'post'
  });

// 获取订单支付信息
export const reqGetPayInfo = (orderId) =>
  requests({
    url: `/payment/weixin/createNative/${orderId}`,
    method: 'get'
  })
