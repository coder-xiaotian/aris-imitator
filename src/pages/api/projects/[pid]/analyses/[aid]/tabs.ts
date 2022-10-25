// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
    const r = await request.get(`https://processmining-us.ariscloud.com/mining/api/int/tenants/supertis2/projects/${req.query.pid}/analyses/${req.query.aid}/tabs?locale=zh-CN&apiTag=22A0`)
    res.status(200).json(r.data)
  } catch (e) {
    console.log(e)
  }
}
