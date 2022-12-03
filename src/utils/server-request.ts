import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'locale=zh-CN; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NzAwNDc0MTgsImp0aSI6Impxdl8wenRfOUx5Z25KZUoxdFZHSG00MXBZWlFlUEVVUThlYUp0ekREM2tpdUU4Iiwic3ViIjoidHN1cGVydGlzQGdtYWlsLmNvbSIsInRlbiI6InN1cGVydGlzMiIsImFwaSI6ZmFsc2V9.cvh9XHzdRL5E3QBzPdYaG7fIQwnAaMMMI5YbyoW4Cqk; apt.sid=AP-SBD10BNWGLHK-2-1670047419640-83329933; apt.uid=AP-SBD10BNWGLHK-2-1670047419640-79749757.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4',
    'csrftoken': 'acNLxgOkkEJ0EoKWBTK17o4HNgbPsbYR_tDrAZu7UOA',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com',
    'origin': 'https://processmining-us.ariscloud.com'
  }
})

export default instance