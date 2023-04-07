export type ProcessData = {
  commonPath: string[]
  nodes: {
    activity: string
    measures: {
      "endnum#SUM": number
      "fnum#SUM": number
      "pnum#SUM": number
      "startnum#SUM": number
    }
  }[]
  edges: {
    from: string
    to: string
    measures: {
      "cnum#SUM": number
      "pnum#SUM": number
    }
  }[]
  status: string
}