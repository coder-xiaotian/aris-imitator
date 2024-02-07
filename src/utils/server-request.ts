import axios from 'axios'

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
const headers = {
  'content-type': 'application/json',
  'user-agent': userAgent,
  'Host': 'processmining.ariscloud.com',
  'origin': 'https://processmining.ariscloud.com'
}
const instance = axios.create({
  headers
})

instance.interceptors.request.use((req) => {
  req.headers!["cookie"] = process.env.accessToken
  if (req.method === "post") {
    req.headers!["csrftoken"] = process.env.csrfToken
  }
  return req
})
instance.interceptors.response.use((res) => {
  return res
}, async (error) => {
  console.error("请求错误，url：", error.request.path, "，状态码：", error.response.status)
  return Promise.reject(error)
})

export default instance