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
    console.log(`设置csrfToken：${process.env.csrfToken}`)
    req.headers!["csrftoken"] = process.env.csrfToken
  }
  return req
})
instance.interceptors.response.use((res) => {
  return res
}, async (error) => {
  console.error("请求错误，url：", error.request.path, "，状态码：", error.response.status)

  if (error.response?.status === 401) {
    const {accessToken, csrfToken} = (await axios.get(process.env.loginServer!)).data
    process.env.accessToken = accessToken
    process.env.csrfToken = csrfToken
    const {method, path, host, protocol} = error.request
    console.log(`登录成功后重新发请求：${protocol}//${host}${path}，cookie：${process.env.accessToken}`)
    const res = await instance[method.toLocaleLowerCase() as "get" | "post"](`${protocol}//${host}${path}`, {
      headers: {
        ...headers,
        "cookie": process.env.accessToken
      }
    })
    console.log("请求重试成功!")
    return Promise.resolve(res)
  }
  return Promise.reject(error)
})

export default instance