import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'apt.uid=AP-SBD10BNWGLHK-2-1669445962901-21963246.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4; apt.sid=AP-SBD10BNWGLHK-2-1669473947589-96272693; locale=zh-CN; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Njk0NzQxMDYsImp0aSI6Ii1adlBCV3pyRFVGY3NrOE9LX3JtRmlKMEprWnlETmFsWlc4WHk1NnhqLWVYMmxwd01XcC1BTjVEVzZjQV9oZ0l5dkh0VXhHOVRVQ3JyQSIsInN1YiI6InRzdXBlcnRpc0BnbWFpbC5jb20iLCJ0ZW4iOiJzdXBlcnRpczIiLCJhcGkiOmZhbHNlfQ.9_yqDWBazZq8ImxSN2HS3QFucJfUoEPo_hhuSm7if0g',
    'csrftoken': '97QpD9Q_BEGyIJwY1HBUdSsNqrFg6lV-0XlWQh0WubI',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com',
    'origin': 'https://processmining-us.ariscloud.com'
  }
})

export default instance