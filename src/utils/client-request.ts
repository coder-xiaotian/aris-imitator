import axios from 'axios'

const instance = axios.create()

instance.interceptors.response.use((res) => {
  return Promise.resolve(res.data)
})

export default instance