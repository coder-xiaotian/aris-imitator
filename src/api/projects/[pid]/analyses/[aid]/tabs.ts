// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
  if (req.method !== 'GET') return

  try {
    const r = await request.get(`https://processmining.ariscloud.com/mining/api/int/tenants/xiaotian3/projects/${req.query.pid}/analyses/${req.query.aid}/tabs?locale=zh-CN&apiTag=22A0`)
    res.status(200).json(r.data)
  } catch (e) {
    if (e instanceof AxiosError) {
      res.status(e.response!.status).json(e.response?.data)
      return
    }
    res.status(500)
  }
}
