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
    if (req.method === 'POST') {
      const r = await request.post("https://processmining-us.ariscloud.com/mining/api/int/tenants/supertis2/dataSets/data/query/simple?locale=zh-CN&apiTag=22A0", req.body)
      res.status(200).json(r.data)
    }
  } catch (e) {
    console.error(e)
  }
}
