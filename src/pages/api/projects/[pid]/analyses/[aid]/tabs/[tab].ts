import type { NextApiRequest, NextApiResponse } from 'next'
import request from '@/utils/server-request'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') return

  try {
    const {aid, tab} = req.query
    const r = await request.get(`https://processmining-us.ariscloud.com/mining/api/int/tenants/supertis2/projects/ky_1/analyses/${aid}/tabs/${tab}?locale=zh-CN&apiTag=22A0`)
    res.status(200).json(r.data)
  } catch (e) {
    console.log(e)
  }
}
