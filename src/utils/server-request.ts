import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'locale=zh-CN; apt.sid=AP-SBD10BNWGLHK-2-1669527454989-75147237; apt.uid=AP-SBD10BNWGLHK-2-1669527454989-38437318.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Njk1Mjc0NjYsImp0aSI6Ii1FSjFUeFNmMVdtRjNMcFRTek1wM3FQRWlxRWFzeWxNb28wVlpFMURiMDhBQ2J0UyIsInN1YiI6InRzdXBlcnRpc0BnbWFpbC5jb20iLCJ0ZW4iOiJzdXBlcnRpczIiLCJhcGkiOmZhbHNlfQ.gzBx0ybjq6N6zPZSCYuVERL_nCDB9NLVRrQ9qapI2xI',
    'csrftoken': 'IK-GwTDvQ3ZqeXj2UjI3bR9HwHwIEAM1S9ngva3-52Q',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com',
    'origin': 'https://processmining-us.ariscloud.com'
  }
})

export default instance