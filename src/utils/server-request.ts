import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'locale=zh-CN; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Njk5ODUzOTcsImp0aSI6IkY3WVZVbUJZM1RsQ0RIX29VSjR5c3lxSHFLdlhxdlR4emJKWldfQjFaYWZTbHVybU5zVG9DcE1UbmVvQjZoQlQiLCJzdWIiOiJ0c3VwZXJ0aXNAZ21haWwuY29tIiwidGVuIjoic3VwZXJ0aXMyIiwiYXBpIjpmYWxzZX0.xr1WrEXkDT1nyObqDPyNk5hemcKq6016HlzeBAC89RM; apt.sid=AP-SBD10BNWGLHK-2-1669985398909-25467856; apt.uid=AP-SBD10BNWGLHK-2-1669985398910-74624181.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4',
    'csrftoken': 'UgRzG3ZXGBKUPQ8KSoV-czePR-E0zLmf5lmWNhNhwAM',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com',
    'origin': 'https://processmining-us.ariscloud.com'
  }
})

export default instance