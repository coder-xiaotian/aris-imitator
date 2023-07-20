import {useRequest} from "ahooks";
import {
  AliasMapping,
  ChartDataResponse,
  ChartType,
  ComponentConfig,
  ComponentRequestInfo,
  FilterInfo
} from "../../apis/typing";
import {getColData} from "@/components/component-config-drawer/utils";
import request from "@/utils/client-request";
import {calcBucketIntervalVal} from "@/components/component-config-drawer/data-config/bucket";
import {useContext, useEffect} from "react";
import {MetaData} from "../../apis/metaInfo";
import {ProcessData} from "../../apis/process";
import {DashBoardContext} from "@/components/layouts/dashboard-layout";

type Props = {
  filterList: FilterInfo[]
  componentConfig: ComponentConfig
  aliasMap: AliasMapping
  metaData: MetaData
  addingFilter: boolean
}
export function useChartData<T = ChartDataResponse["rows"][0]>({filterList, addingFilter, componentConfig, aliasMap, metaData}: Props) {
  const {datasetId} = useContext(DashBoardContext)

  // 获取图表的数据
  const {data, loading, error, run: requstData} = useRequest((filters = []) => {
    function handleMeasureParams() {
      const measures = componentConfig.type === ChartType.PIE ? componentConfig.requestState.measureConfigs?.slice(0, 1) : componentConfig.requestState.measureConfigs
      return measures?.map((m, i) => {
        const colData = getColData(m.alias, aliasMap, metaData)
        const type = /*chartConfig.type !== ChartType.DIST && chartConfig.type !== ChartType.TIME ?*/
          m.aggregation === 'countDistinct' && m.granularities && m.granularities !== 'noTransformation' ? 'CountDistinctDate' as const : 'Agg' as const
        // : 'Distribution' as const

        return {
          type,
          key: colData!.key,
          asColumn: `y${i}`,
          aggregation: m.aggregation,
          granularities: m.granularities !== 'noTransformation' ? m.granularities : undefined
        }
      }) ?? []
    }
    return request.post<any, ChartDataResponse<T>, ComponentRequestInfo>(`/api/dataSets/${datasetId}/query/simple`,
      {
        considerDistinct: false,
        includeNullValues: componentConfig.requestState.includeNullValues,
        size: componentConfig.type === ChartType.PIE ? 50 :
          componentConfig.type === ChartType.GRID ? 10000
            : 4000,
        sortCriteria: [],
        filterList: {
          type: 'FilterList',
          filters,
          mode: 'AND'
        },
        selections: [...componentConfig.requestState.dimensions?.map((d, i) => {
          const colData = getColData(d.alias, aliasMap, metaData)
          const selection: any = {
            type: componentConfig.type !== ChartType.DIST && componentConfig.type !== ChartType.TIME ? 'Standard' as const : 'Distribution' as const,
            key: colData!.key,
            asColumn: `x${i}`,
          }
          if (componentConfig.type === ChartType.TIME) {
            selection.config = {
              type: "timeDistributionConfig",
              interval: componentConfig.requestState.options?.bucketInterval,
              timeUnit: componentConfig.requestState.options?.timeUnit
            }
          } else if (componentConfig.type === ChartType.DIST) {
            if (componentConfig.requestState.options!.type === 1) {
              selection.config = {
                interval: calcBucketIntervalVal(componentConfig.requestState.options?.bucketIntervalUnit || componentConfig.requestState.options?.timeUnit,
                  componentConfig.requestState.options?.bucketInterval ?? 0, "multiply"),
                type: "distributionConfig"
              }
            } else {
              selection.numBuckets = componentConfig.requestState.options!.numberOfBuckets! + (componentConfig.requestState.options?.otherBucketPercentage ? 1 : 0)
              selection.otherBucketPercentage = componentConfig.requestState.options?.otherBucketPercentage
              selection.type = "AutoDistribution"
            }
          }

          return selection
        }) ?? [], ...handleMeasureParams()]
      })
      .catch(e => {
        return Promise.reject(e.response.data)
      })
  }, {
    refreshDeps: [componentConfig.requestState, componentConfig.type],
    debounceWait: 500,
  })
  useEffect(() => { // 之所以单独对filterList做监听，是为了能够对其判空，为空且正在添加临时过滤器则不请求接口
    if (!filterList.length && addingFilter) return

    requstData(filterList)
  }, [filterList, addingFilter])

  return {
    data,
    loading,
    error
  }
}

export enum NodeType {
  StartEnd = "1",
  Normal = "2"
}
export enum StartEndNodeName {
  Start= "流程开始",
  End = "流程结束"
}
export enum EdgeType {
  StartEnd = "1",
  Normal = "2"
}
export type NodeInfo = {
  type: NodeType
  name: string
  measure: number,
  percent?: string,
  isStart?: boolean,
  isEnd?: boolean
  x?: number
  y?: number
  width?: number
  height?: number
  level?: number
}
export type EdgeInfo = {
  type: EdgeType
  from: string
  to: string,
  measure: number
  d?: string
  level?: number
  labelPos?: [number, number]
}
export type GraphInfo = {
  nodes: NodeInfo[]
  edges: EdgeInfo[]
  viewBox: string
}
export function useProcessData({filterList, addingFilter, componentConfig, aliasMap, metaData}: Props) {
  const {datasetId} = useContext(DashBoardContext)

  const {data: totalCaseData} = useRequest(() => request.post<any, any, any>(`/api/dataSets/${datasetId}/query/simple`, {
    "selections": [
      {
        "type": "Agg",
        "key": "pnum",
        "asColumn": "pnum",
        "aggregation": "sum",
        "considerDistinct": false
      }
    ],
    "filterList": {
      "type": "FilterList",
      "mode": "AND",
      "filters": []
    }
  }))
  // 获取流程图数据
  const {data: nodeStepList = [], loading, run: requestProcessData} = useRequest((filters = []) => {
    return request.post<any, ProcessData, any>(`/api/dataSets/${datasetId}/query/processExplorer`, {
      withCommonPath: true,
      nodes: {
        activityName: "activity_name",
        measures: [
          {
            type: "Agg",
            key: "pnum",
            asColumn: "pnum#SUM",
            aggregation: "sum",
            considerDistinct: false
          },
          {
            type: "Agg",
            key: "fnum",
            asColumn: "fnum#SUM",
            aggregation: "sum",
            considerDistinct: false
          },
          {
            type: "Agg",
            key: "endnum",
            asColumn: "endnum#SUM",
            aggregation: "sum",
            considerDistinct: false
          },
          {
            type: "Agg",
            key: "startnum",
            asColumn: "startnum#SUM",
            aggregation: "sum",
            considerDistinct: false
          }
        ]
      },
      edges: {
        to: "to_name",
        from: "from_name",
        measures: [
          {
            type: "Agg",
            key: "pnum",
            asColumn: "pnum#SUM",
            aggregation: "sum",
            considerDistinct: false
          },
          {
            type: "Agg",
            key: "cnum",
            asColumn: "cnum#SUM",
            aggregation: "sum",
            considerDistinct: false
          }
        ]
      },
      filterList: {
        type: "FilterList",
        mode: "AND",
        filters
      }
    })
      .then(res => {
        const totalCase = totalCaseData.rows[0][0]
        const inscrease = (totalCase / 7) + 1
        const resList = []
        const commonPath = res.commonPath
        const startEdgeAndEndEdgeList: any = []
        const firstGraph: Omit<GraphInfo, "viewBox" | "width" | "height"> = {
          nodes: [{
            type: NodeType.StartEnd,
            name: StartEndNodeName.Start,
            measure: totalCase,
          } as NodeInfo, {
            type: NodeType.StartEnd,
            name: StartEndNodeName.End,
            measure: totalCase,
          }].concat(...commonPath.map(name => {
            const nodeData = res.nodes.find(item => item.activity === name)!
            let isStart = true, isEnd = true
            if (nodeData.measures["startnum#SUM"] === 0 &&
              nodeData.measures["endnum#SUM"] !== 0) {
              // 因为开始边和结束边是没有在返回结果里的，所以这里要单独处理
              startEdgeAndEndEdgeList.push({
                type: EdgeType.StartEnd,
                from: nodeData.activity,
                to: StartEndNodeName.End,
                measure: nodeData.measures["pnum#SUM"],
                level: getLevel(nodeData.measures["pnum#SUM"], inscrease)
              })
              isStart = false
            } else if (nodeData.measures["startnum#SUM"] !== 0 &&
              nodeData.measures["endnum#SUM"] === 0) {
              startEdgeAndEndEdgeList.push({
                type: EdgeType.StartEnd,
                from: StartEndNodeName.Start,
                to: nodeData.activity,
                measure: nodeData.measures["pnum#SUM"],
                level: getLevel(nodeData.measures["pnum#SUM"], inscrease)
              })
              isEnd = false
            }

            const percent = Number((nodeData.measures["pnum#SUM"]/totalCase) * 100).toFixed(1) + "%"
            return {
              type: NodeType.Normal,
              name,
              measure: nodeData.measures["pnum#SUM"],
              percent,
              isStart,
              isEnd,
              level: getLevel(nodeData.measures["pnum#SUM"], inscrease)
            }
          })),
          edges: res.edges.filter(edge => {
            if (commonPath.includes(edge.from) && commonPath.includes(edge.to)) {
              return true
            }

            return false
          }).map(edge => {
            return {
              type: EdgeType.Normal,
              from: edge.from,
              to: edge.to,
              measure: edge.measures["pnum#SUM"],
              level: getLevel(edge.measures["pnum#SUM"], inscrease)
            }
          }).concat(...startEdgeAndEndEdgeList).sort((a, b) => b.measure - a.measure)
        }
        resList.push(firstGraph)

        const sortedNode = res.nodes
          .filter(node => !commonPath.includes(node.activity))
          .sort((a, b) => b.measures["pnum#SUM"] - a.measures["pnum#SUM"])
        let pushGraph: any, prevNode: typeof sortedNode[0], prevGraph = firstGraph
        sortedNode.forEach(node => {
          if (prevNode?.measures["pnum#SUM"] === node.measures["pnum#SUM"]) {
            pushGraph = prevGraph // 这里是处理指标相等的情况，指标相等则放在一个step里
          } else {
            pushGraph = {}
            resList.push(pushGraph)
          }

          const percent = Number((node.measures["pnum#SUM"]/totalCase) * 100).toFixed(1) + "%"
          pushGraph.nodes = [...prevGraph.nodes, {
            type: NodeType.Normal,
            name: node.activity,
            measure: node.measures["pnum#SUM"],
            level: getLevel(node.measures["pnum#SUM"], inscrease),
            percent
          }]
          pushGraph.edges = [...prevGraph.edges, ...res.edges.filter(edge => {
            const inPrevEdges = prevGraph.edges.find(item => item.from === edge.from && item.to === edge.to)
            const inPrevNodes = pushGraph.nodes.find((item: any) => item.name === edge.from || item.name === edge.to)
            return !inPrevEdges && inPrevNodes
          }).map(edge => ({
            type: EdgeType.Normal,
            from: edge.from,
            to: edge.to,
            measure: edge.measures["pnum#SUM"],
            level: getLevel(edge.measures["pnum#SUM"], inscrease)
          }))]
          if (node.measures["startnum#SUM"] === 0 && node.measures["endnum#SUM"] !== 0) {
            pushGraph.edges.push({
              type: EdgeType.Normal,
              from: node.activity,
              to: StartEndNodeName.End,
              measure: node.measures["pnum#SUM"],
              level: getLevel(node.measures["pnum#SUM"], inscrease)
            })
          } else if (node.measures["startnum#SUM"] !== 0 &&
            node.measures["endnum#SUM"] === 0) {
            pushGraph.edges.push({
              type: EdgeType.Normal,
              from: StartEndNodeName.Start,
              to: node.activity,
              measure: node.measures["pnum#SUM"],
              level: getLevel(node.measures["pnum#SUM"], inscrease)
            })
          }
          pushGraph.edges = pushGraph.edges.sort((a: any, b: any) => b.measure - a.measure)

          prevGraph = pushGraph
          prevNode = node
        })

        return resList
    })
  }, {ready: !!totalCaseData})
  useEffect(() => { // 之所以单独对filterList做监听，是为了能够对其判空，为空且正在添加临时过滤器则不请求接口
    if (!filterList.length && addingFilter) return

    requestProcessData(filterList)
  }, [filterList, addingFilter])

  return {
    nodeStepList,
    loading,
  }
}

function getLevel(measure: number, inscrease: number) {
  if (measure >= 0 && measure < inscrease) {
    return 1
  } else if (measure >= inscrease && measure < inscrease * 2) {
    return 2
  } else if (measure >= inscrease * 2 && measure < inscrease * 3) {
    return 3
  } else if (measure >= inscrease * 3 && measure < inscrease * 4) {
    return 4
  } else if (measure >= inscrease * 4 && measure < inscrease * 5) {
    return 5
  } else {
    return 6
  }
}