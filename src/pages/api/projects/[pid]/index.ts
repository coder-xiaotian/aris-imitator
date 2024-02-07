import type { NextApiRequest, NextApiResponse } from 'next'
import request from '@/utils/server-request'
import {AxiosError} from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return

  try {
    const r = await request.get(`https://processmining.ariscloud.com/mining/api/int/tenants/${process.env.tenantName}/projects/${req.query.pid}?locale=zh-CN&apiTag=230A`)
    res.status(200).json(r.data)
  } catch (e) {
    if (e instanceof AxiosError) {
      res.status(e.response?.status ?? 500).json(e.response?.data)
      return
    }
    res.status(500)
  }
}
