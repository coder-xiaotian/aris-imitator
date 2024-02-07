import type { NextApiRequest, NextApiResponse } from 'next'
import EventSource from "eventsource"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.writeHead(200, {
    "Content-Type":"text/event-stream",
    "Cache-Control":"no-cache, no-transform",
    "Connection":"keep-alive",
    "Access-Control-Allow-Origin": '*',
  });
  if (process.env.accessToken) {
    res.write("event: close\ndata: close\n\n")
  } else {
    const source = new EventSource(process.env.loginServer!)
    source.addEventListener("message", (e) => {
      console.log(e.data)
      res.write("data: " + e.data + "\n\n")
    })
    source.addEventListener("token", (e) => {
      const {accessToken, csrfToken} = JSON.parse(e.data)
      process.env.accessToken = accessToken
      process.env.csrfToken = csrfToken
      res.write("event: close\ndata: close\n\n")
      setTimeout(() => {
        process.env.accessToken = undefined
        process.env.csrfToken = undefined
      }, 30 * 60 * 1000)
    })
  }
}
