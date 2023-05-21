import type { NextApiRequest, NextApiResponse } from 'next'
import request from '@/utils/server-request'
import {AxiosError} from "axios";

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const {pid, aid, tab} = req.query
    if (req.method === 'GET') {
      const r = await request.get(`https://processmining.ariscloud.com/mining/api/int/tenants/${process.env.tenantName}/projects/${pid}/analyses/${aid}/tabs/${tab}?locale=zh-CN&apiTag=2340`)
      res.status(200).json(r.data)
    } else if (req.method === 'PUT') {
      const r = await request.put(`https://processmining.ariscloud.com/mining/api/int/tenants/${process.env.tenantName}/projects/${pid}/analyses/${aid}/tabs/${tab}?locale=zh-CN&apiTag=2340`, req.body)
      res.status(200).json(r.data)
    }
  } catch (e) {
    if (e instanceof AxiosError) {
      res.status(e.response!.status).json(e.response?.data)
      return
    }
    res.status(500)
  }
}
