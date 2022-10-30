import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'locale=zh-CN; apt.uid=AP-SBD10BNWGLHK-2-1667134557252-35676762.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjcxMzk1NzMsImp0aSI6IjNKRzBYME9WSWYzRU1TaXg4WU9XWXBiM3lHczhkZ3UwUkk3SmY3QjBTRFVvSnBGZjY1bDY3bmdtYjRxTiIsInN1YiI6InRzdXBlcnRpc0BnbWFpbC5jb20iLCJ0ZW4iOiJzdXBlcnRpczIiLCJhcGkiOmZhbHNlfQ.vrDQnl5KbuTlwmdfE8hH5xytFV_gx1njEMkI-kwvkow',
    'csrftoken': 'sM7uxFeFDsukhwbhintm0QQeI_AiJhMLyZuFb0apkc8',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com',
    'origin': 'https://processmining-us.ariscloud.com'
  }
})

export default instance