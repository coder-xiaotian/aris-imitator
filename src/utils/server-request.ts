import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'locale=zh-CN; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Njg2OTY3MzMsImp0aSI6IkF4NFBaUnZSZ3dsRF9ZQmF3WDBHRGdGSlhKckg2MGwtelV6R0lnenR4eDNwWkg4d1JlWnZKclFXRmM0bjl5bS1sMFkiLCJzdWIiOiJ0c3VwZXJ0aXNAZ21haWwuY29tIiwidGVuIjoic3VwZXJ0aXMyIiwiYXBpIjpmYWxzZX0.pdcC8QTrhog28Zu65SvifrhpAcyOhLhpnLKyJ2PO4qA; apt.sid=AP-SBD10BNWGLHK-2-1668696736614-27917245; apt.uid=AP-SBD10BNWGLHK-2-1668696736615-48213125.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4',
    'csrftoken': 'hjo5JqEmaLTfwVXwG5TDsgXVlINLE1awxXq3DLxI3eg',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com',
    'origin': 'https://processmining-us.ariscloud.com'
  }
})

export default instance