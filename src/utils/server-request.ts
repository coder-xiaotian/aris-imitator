import axios from 'axios'
import puppeteer, {Browser} from 'puppeteer';

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
const headers = {
  'content-type': 'application/json',
  'user-agent': userAgent,
  'Host': 'processmining.ariscloud.com',
  'origin': 'https://processmining.ariscloud.com'
}
const instance = axios.create({
  headers
})

let browser: Browser | boolean
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
    if (!browser) {
      browser = true
      console.log("重新登录")
      browser = await puppeteer.launch({headless: true})

      const page = (await browser.pages())[0]
      await page.setUserAgent(userAgent)
      await page.setCookie({
        name: "NecessaryCookiesAccepted",
        value: "Accepted",
        domain: ".mc.ariscloud.com",
        path: "/",
        expires: 1710593559863,
        secure: true,
        sameSite: "Lax",
        priority: "Medium"})
      console.log("跳转到登录页")
      await page.goto("https://mc.ariscloud.com/login")
      await page.type("#tenantName", process.env.tenantName!)
      await page.click(".login-form button")
      await page.type("#userEmail", process.env.account!)
      await page.type("#userPassword", process.env.password!)
      console.log("等待登录")
      await Promise.all([
        page.waitForResponse(async response => {
          const status = response.url().endsWith("/service/login") && response.status() === 200
          if (status) {
            process.env.csrfToken = (await response.json()).csrfToken
            console.log("登录成功！csrfToken为：", process.env.csrfToken)
          }
          return status
        }),
        page.click("#login button[type=\"submit\"]")
      ])
      const cookies = await page.cookies()
      const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join("; ")
      process.env.accessToken = cookieStr
      await page.close()
      await browser.close()

      const {method, path, host, protocol} = error.request
      console.log(`登录成功后重新发请求：${protocol}//${host}${path}，cookie：${cookieStr}`)
      const res = await instance[method.toLocaleLowerCase() as "get" | "post"](`${protocol}//${host}${path}`, {
        headers: {
          ...headers,
          "cookie": cookieStr
        }
      })
      console.log("请求重试成功!")
      return Promise.resolve(res)
    }
  }
  return Promise.reject(error)
})

export default instance