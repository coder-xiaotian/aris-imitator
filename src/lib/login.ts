import chromium from 'chrome-aws-lambda';

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
export default async () => {
  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
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
  await page.type("#tenantName", process.env.tenantName!)
  await page.click(".login-form button")
  await page.type("#userEmail", process.env.account!)
  await page.type("#userPassword", process.env.password!)
  console.log("等待登录")
  await Promise.all([
    page.waitForResponse(async (response) => {
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
  return await browser.close()
}