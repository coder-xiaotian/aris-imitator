import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'locale=zh-CN; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Njk1NTc2MzYsImp0aSI6Im1fWUt3bzBOMGZhRnU4SlJyR3ZEd29uUWlscWNDUnBaV2xuQ0hjeTh5bUI2SHRWLUZCOGNjNHhpMUZ4S3dxT3UiLCJzdWIiOiJ0c3VwZXJ0aXNAZ21haWwuY29tIiwidGVuIjoic3VwZXJ0aXMyIiwiYXBpIjpmYWxzZX0.lQX4emRrLFdKrU_VkbEtDmIzF9EKEFOvQRw2rr8JeHE; apt.sid=AP-SBD10BNWGLHK-2-1669557641561-76971726; apt.uid=AP-SBD10BNWGLHK-2-1669557641561-67116723.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4',
    'csrftoken': 'BX6DT-H4X7b6TXNfhc_ImefvpD1H7AtfIx9OcFMoiqQ',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com',
    'origin': 'https://processmining-us.ariscloud.com'
  }
})

export default instance