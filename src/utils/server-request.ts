import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'locale=zh-CN; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Njg3ODA2MjEsImp0aSI6IjBzX21iYmpOZWdYUkFYYWpHTEdMczVfZjJOb0tVRVdqMWs3MG9DRmFRWktVdHVZVjhnIiwic3ViIjoidHN1cGVydGlzQGdtYWlsLmNvbSIsInRlbiI6InN1cGVydGlzMiIsImFwaSI6ZmFsc2V9.nmOrB2m4r9qWX57BV5i00ZPyC6KPm-JedAcHOQB84TQ; apt.sid=AP-SBD10BNWGLHK-2-1668780624290-49916622; apt.uid=AP-SBD10BNWGLHK-2-1668780624291-48337552.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4',
    'csrftoken': 'wzoR4OmfBj9YPUSRwPo_MMx839b-9RSZd36JojbaXUQ',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com',
    'origin': 'https://processmining-us.ariscloud.com'
  }
})

export default instance