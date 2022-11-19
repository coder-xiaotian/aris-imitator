import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'locale=zh-CN; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Njg4NjgxNTUsImp0aSI6IlRvSUUyVURkV3ZCTDYxMmNOQ2ZYSklLaXJaT3Zyb1BsVXFFbHhEZXFNYUxOS0lmdUtJSWdleERNeDlSUDhUM1daRkNwY2E2ayIsInN1YiI6InRzdXBlcnRpc0BnbWFpbC5jb20iLCJ0ZW4iOiJzdXBlcnRpczIiLCJhcGkiOmZhbHNlfQ.1Xa2LoqSIEB76hguU6Th72-1SM2sqwF_Jy_D--2iwGs; apt.sid=AP-SBD10BNWGLHK-2-1668868156888-97386552; apt.uid=AP-SBD10BNWGLHK-2-1668868156888-47852824.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4',
    'csrftoken': 'jDIu6RkVDaeYQ2eow3Hzv10NHOOKlU4K4UEiAAX-Xoo',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com',
    'origin': 'https://processmining-us.ariscloud.com'
  }
})

export default instance