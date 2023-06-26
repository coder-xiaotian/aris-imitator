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
import {useRouter} from "next/router";
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

const nodeType = {
  StartEnd: 1,
  Normal: 2
}
const edgeType = {
  StartEnd: 1,
  Normal: 2
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
  const {data: nodeStepList, loading, run: requestProcessData} = useRequest((filters = []) => {
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
        const resList = []
        const commonPath = res.commonPath
        const startEdgeAndEndEdgeList: any = []
        const startNodeName = "流程开始"
        const endNodeName = "流程结束"
        const firstGraph = {
          nodes: [{
            type: nodeType.StartEnd,
            name: startNodeName,
            measures: {
              case: totalCase,
            }
          }, {
            type: nodeType.StartEnd,
            name: endNodeName,
            measures: {
              case: totalCase,
            }
          }].concat(...commonPath.map(name => {
            const nodeData = res.nodes.find(item => item.activity === name)!
            let isStart = true, isEnd = true
            if (nodeData.measures["startnum#SUM"] === 0) {
              startEdgeAndEndEdgeList.push({
                type: edgeType.StartEnd,
                from: nodeData.activity,
                to: endNodeName,
                measures: {
                  case: nodeData.measures["pnum#SUM"]
                }
              })
              isStart = false
            }
            if (nodeData.measures["endnum#SUM"] === 0) {
              startEdgeAndEndEdgeList.push(nodeData)
              startEdgeAndEndEdgeList.push({
                type: edgeType.StartEnd,
                from: endNodeName,
                to: nodeData.activity,
                measures: {
                  case: nodeData.measures["pnum#SUM"]
                }
              })
              isEnd = false
            }

            return {
              type: nodeType.Normal,
              name,
              measures: {
                case: nodeData.measures["pnum#SUM"],
                isStart,
                isEnd,
              }
            }
          })),
          edges: res.edges.filter(edge => {
            if (commonPath.includes(edge.from) && commonPath.includes(edge.to)) {
              return true
            }

            return false
          }).map(edge => {
            return {
              type: edgeType.Normal,
              from: edge.from,
              to: edge.to,
              measures: {
                case: edge.measures["pnum#SUM"]
              }
            }
          }).concat(...startEdgeAndEndEdgeList).sort((a, b) => b.measures["case"] - a.measures["case"])
        }
        resList.push(firstGraph)

        const sortedNode = res.nodes
          .filter(node => !commonPath.includes(node.activity))
          .sort((a, b) => b.measures["pnum#SUM"] - a.measures["pnum#SUM"])
        let pushGraph: any, prevNode: typeof sortedNode[0], prevGraph = firstGraph
        sortedNode.forEach(node => {
          if (prevNode?.measures["pnum#SUM"] === node.measures["pnum#SUM"]) {
            pushGraph = prevGraph
          } else {
            pushGraph = {}
            resList.push(pushGraph)
          }

          pushGraph.nodes = [...prevGraph.nodes, {
            type: nodeType.Normal,
            name: node.activity,
            measures: {
              case: node.measures["pnum#SUM"],
            }
          }]
          pushGraph.edges = [...prevGraph.edges, ...res.edges.filter(edge => {
            const inPrevEdges = prevGraph.edges.find(item => item.from === edge.from && item.to === edge.to)
            const inPrevNodes = pushGraph.nodes.find((item: any) => item.name === edge.from)
              && pushGraph.nodes.find((item: any) => item.name === edge.to)
            return !inPrevEdges && inPrevNodes
          }).map(edge => ({
            type: edgeType.Normal,
            from: edge.from,
            to: edge.to,
            measures: {
              case: edge.measures["pnum#SUM"]
            }
          }))]
          if (node.measures["startnum#SUM"] === 0) {
            pushGraph.edges.push({
              type: edgeType.Normal,
              from: node.activity,
              to: endNodeName,
              measures: {
                case: node.measures["pnum#SUM"]
              }
            })
          } else if (node.measures["endnum#SUM"] === 0) {
            pushGraph.edges.push({
              type: edgeType.Normal,
              from: startNodeName,
              to: node.activity,
              measures: {
                case: node.measures["pnum#SUM"]
              }
            })
          }
          pushGraph.edges = pushGraph.edges.sort((a: any, b: any) => b.measures["case"] - a.measures["case"])

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