import axios from 'axios'

const instance = axios.create({
  headers: {
    'content-type': 'application/json',
    'cookie': 'locale=zh-CN; apt.sid=AP-SBD10BNWGLHK-2-1668000196829-57743417; apt.uid=AP-SBD10BNWGLHK-2-1668000196829-14339314.0.2.79ca12eb-42f0-4bf8-bf7c-0bd8da0349c4; accesstoken=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjgwMDAyMjUsImp0aSI6IlBuejJKbHpvM3JfVTd3bGVJN25VRHlMcm44ZkRVSmRrZVozX0tqU3NYTU12R29TcEFGTU04TllLNElRamphNjZHZyIsInN1YiI6InRzdXBlcnRpc0BnbWFpbC5jb20iLCJ0ZW4iOiJzdXBlcnRpczIiLCJhcGkiOmZhbHNlfQ.l_GhOPxbxfuOlzj-1HFOzsUIEWiSuBrytVTtYEcXimM',
    'csrftoken': 'R9M2vb0_uK-uIfmdVruQTFbBJ_ZARrCSwfAy3q-dPvE',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Host': 'processmining-us.ariscloud.com',
    'origin': 'https://processmining-us.ariscloud.com'
  }
})

export default instance