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
    const {datasetId} = req.query
    if (req.method === 'POST') {
      const r = await request.post(`https://processmining.ariscloud.com/mining/api/int/tenants/${process.env.tenantName}/dataSets/${datasetId}/query/simple?locale=zh-CN&apiTag=230A`, req.body)
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
