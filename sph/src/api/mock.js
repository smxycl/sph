import axios from 'axios'
const mockAjax = axios.create({
  baseURL: '/mock'
})
export default mockAjax