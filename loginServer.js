const puppeteer = require('puppeteer');
const express = require('express')
require("dotenv").config()

const app = express()

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'

app.get('/login', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      //   "–disable-gpu", // GPU硬件加速
      //   "–disable-dev-shm-usage", // 创建临时文件共享内存
      //   "–disable-setuid-sandbox", // uid沙盒
      //   "–no-first-run", // 没有设置首页。在启动的时候，就会打开一个空白页面。
      "--no-sandbox", // 沙盒模式
      //   "–no-zygote",
      //   "–single-process" // 单进程运行
    ]
  })
  console.log("打开了浏览器")

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
  await page.type("#[projectName]", process.env.tenantName)
  await page.click(".login-form button")
  await page.type("#userEmail", process.env.account)
  await page.type("#userPassword", process.env.password)
  console.log("等待登录")
  let csrfToken
  await Promise.all([
    page.waitForResponse(async response => {
      const status = response.url().endsWith("/service/login") && response.status() === 200
      if (status) {
        csrfToken = (await response.json()).csrfToken
        console.log("登录成功！csrfToken为：", csrfToken)
      }
      return status
    }),
    page.click("#login button[type=\"submit\"]")
  ])
  const cookies = await page.cookies()
  const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join("; ")
  await page.close()
  await browser.close()

  res.json({accessToken: cookieStr, csrfToken})
})

app.listen(8000, () => {
  console.log("login server started!")
})