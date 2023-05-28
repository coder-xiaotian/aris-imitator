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
export function useProcessData({filterList, addingFilter, componentConfig, aliasMap, metaData}: Props) {
  const {datasetId} = useContext(DashBoardContext)

  // 获取流程图数据
  const {data, loading, run: requestProcessData} = useRequest((filters = []) => {
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
        console.log(res)
        return res
    })
  })
  useEffect(() => { // 之所以单独对filterList做监听，是为了能够对其判空，为空且正在添加临时过滤器则不请求接口
    if (!filterList.length && addingFilter) return

    requestProcessData(filterList)
  }, [filterList, addingFilter])

  return {
    data,
    loading,
  }
}