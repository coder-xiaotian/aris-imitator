import type { NextApiRequest, NextApiResponse } from 'next'
import request from '@/utils/server-request'
import {AxiosError} from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {datasetId} = req.query
    if (req.method === 'POST') {
      const r = await request.post(`https://processmining.ariscloud.com/mining/api/int/tenants/${process.env.tenantName}/dataSets/${datasetId}/query/processExplorer?locale=zh-CN&apiTag=2340`, req.body)
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