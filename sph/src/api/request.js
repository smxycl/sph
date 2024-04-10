// 对于axios进行二次封装
import axios from "axios";
//在当前模块中引入store
import detail from '@/store/detail';
import user from '@/store/user';
const requests = axios.create({
  // 配置对象
  // 基础路径，发请求的时候，路径中会（默认加上）出现api
  baseURL: "/api",
  // 代表请求超时时间为5s  超过5s请求失败
  timeout: 5000,
});
requests.interceptors.request.use((config) => {
  if (detail.state.uuid_token) {
    //请求头添加一个字段(userTempId):和后台老师商量好了
    config.headers.userTempId = detail.state.uuid_token;
  }
  if (user.state.token) {
    //请求头添加一个字段(userTempId):和后台老师商量好了
    config.headers.token = user.state.token;
  }
  return config
})

// 对外暴露
export default requests;
