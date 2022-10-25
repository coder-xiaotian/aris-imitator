import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'locale=zh-CN; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjY3MDIyMjEsImp0aSI6InNwMzhPMFl4ZjZtYm1EdDg3MEVVeWRCbHVUa2lnaFVHT0V4UkhRTU52NjZZZVdlcFE1RC1xM193cFZUM0hnIiwic3ViIjoidHN1cGVydGlzQGdtYWlsLmNvbSIsInRlbiI6InN1cGVydGlzMiIsImFwaSI6ZmFsc2V9.SPU4FAb2jxn7AfRIwVFZ0zkOXzqZjvrHzfOjgRVOk-c; apt.sid=AP-SBD10BNWGLHK-2-1666702224801-19191464; apt.uid=AP-SBD10BNWGLHK-2-1666702224802-29594796.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com'
  }
})

export default instance