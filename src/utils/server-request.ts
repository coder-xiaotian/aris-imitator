import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'locale=zh-CN; apt.sid=AP-SBD10BNWGLHK-2-1669818270326-51746195; apt.uid=AP-SBD10BNWGLHK-2-1669818270327-96257449.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Njk4MTgzODksImp0aSI6InRqMG5LWDlMN1BqY2RxM01DNU1KWEdJRzNoQ0xJRDVVZDd1RW1KU1FDbTRhTVF2MnRJdnRsNy10cndmcnk0MGtrUUEiLCJzdWIiOiJ0c3VwZXJ0aXNAZ21haWwuY29tIiwidGVuIjoic3VwZXJ0aXMyIiwiYXBpIjpmYWxzZX0.Isy-_DTcEQP0PRczxtMzAKSaVs7XivT4P-1XPUQ8H9M',
    'csrftoken': 'oFZZAlkosiX7dUSGJubHJgEEW1_nuwAbPyIqC_VllcM',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com',
    'origin': 'https://processmining-us.ariscloud.com'
  }
})

export default instance