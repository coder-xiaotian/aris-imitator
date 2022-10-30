import type { NextApiRequest, NextApiResponse } from 'next'
import request from '@/utils/server-request'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const {aid, tab} = req.query
    if (req.method === 'GET') {
      const r = await request.get(`https://processmining-us.ariscloud.com/mining/api/int/tenants/supertis2/projects/ky_1/analyses/${aid}/tabs/${tab}?locale=zh-CN&apiTag=22A0`)
      res.status(200).json(r.data)
    } else if (req.method === 'PUT') {
      const r = await request.put(`https://processmining-us.ariscloud.com/mining/api/int/tenants/supertis2/projects/ky_1/analyses/${aid}/tabs/${tab}?locale=zh-CN&apiTag=22A0`, req.body)
      res.status(200).json(r.data)
    }
  } catch (e) {
    console.error(e)
  }
}
