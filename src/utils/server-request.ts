import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'locale=zh-CN; apt.sid=AP-SBD10BNWGLHK-2-1667742550752-33255331; apt.uid=AP-SBD10BNWGLHK-2-1667742550752-68943633.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Njc3NDI2NDYsImp0aSI6ImMxamgyQlZXUVA1SHdBMVJ4bXNwMGdYUUI5dDE1dkRRbFhMMXIwWDh3Tjg1X3ZqQVd3Q29wQlo4dDkwIiwic3ViIjoidHN1cGVydGlzQGdtYWlsLmNvbSIsInRlbiI6InN1cGVydGlzMiIsImFwaSI6ZmFsc2V9.iLLEn2hcX6exfui-0m52bcXPF0nK6yASaJPK3lzpU98',
    'csrftoken': 'o0fnsXGQt6awXVrPJZ0psaeW2qgssIycQUy7Mj4HwK8',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com',
    'origin': 'https://processmining-us.ariscloud.com'
  }
})

export default instance