import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'locale=zh-CN; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Njg4MzMyNzAsImp0aSI6IkpVcENWR1ZLOHl1dEpJd0RENWVqM0hMMFd5eUpnaGttUktUZ1FhbDczOExnOWp2eGlicVM0dWtXLTRGck5XZElsQ0FUbVM1aFZnIiwic3ViIjoidHN1cGVydGlzQGdtYWlsLmNvbSIsInRlbiI6InN1cGVydGlzMiIsImFwaSI6ZmFsc2V9.PBjwGcudYE5CZSOv2zPZF7mlbG3bkOTMUtT1RWWtGB4; apt.sid=AP-SBD10BNWGLHK-2-1668833274750-71358213; apt.uid=AP-SBD10BNWGLHK-2-1668833274751-36615965.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4',
    'csrftoken': 'nNcBiZ4C65XLGZVVxg5Et-Li_Hi6Rcr9dFNaGw27vDU',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com',
    'origin': 'https://processmining-us.ariscloud.com'
  }
})

export default instance