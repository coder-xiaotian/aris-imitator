import {
  AliasMapping,
  ChartDataResponse,
  ChartType,
  ComponentConfig,
  ComponentRequestInfo,
  ComponentType,
  FilterInfo
} from "../../apis/typing";
import {memo, useEffect, useRef} from 'react'
import {getColData} from "@/components/component-config-drawer/utils";
import {useDebounceFn, useRequest} from "ahooks";
import {Spin} from "antd";
import {MetaData} from "../../apis/metaInfo";
import Chart, {SelectFilterHandler} from './chart'
import request from '@/utils/client-request'
import ResizeObserver from "rc-resize-observer";
import {calcBucketIntervalVal} from "@/components/component-config-drawer/data-config/bucket";
import Table from "@/components/component-item/table";

type ComponentItemProps = {
  componentConfig: ComponentConfig
  aliasMap: AliasMapping
  metaData: MetaData
  addingFilter: boolean
  onSelectFilter: SelectFilterHandler
  filterList: FilterInfo[]
}
export default memo(({componentConfig, aliasMap, metaData, addingFilter, filterList, onSelectFilter}: ComponentItemProps) => {
  // 获取图表的数据
  const {data, loading, error, run: requstData} = useRequest((fList = []) => request.post<any, ChartDataResponse, ComponentRequestInfo>('/api/dataSets/my_test/query/simple',
    {
    considerDistinct: false,
    includeNullValues: componentConfig.requestState.includeNullValues,
    size: componentConfig.type === ChartType.PIE ? 50 :
      componentConfig.type === ChartType.GRID ? 10000
        : 4000,
    sortCriteria: [],
    filterList: {
      type: 'FilterList',
      filters: fList,
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
    }) ?? [], ...componentConfig.requestState.measureConfigs?.map((m, i) => {
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
    }) ?? []]
  })
    .catch(e => {
      return Promise.reject(e.response.data)
    }), {
    refreshDeps: [componentConfig.requestState],
    debounceWait: 500,
  })
  useEffect(() => { // 之所以单独对filterList做监听，是为了能够对其判空，为空且正在添加临时过滤器则不请求接口
    if (!filterList.length && addingFilter) return

    requstData(filterList)
  }, [filterList, addingFilter])

  const comMap = {
    [ComponentType.CHART as string]: componentConfig.type === "grid" ?
                                        <Table data={data}
                                               title={componentConfig.viewState.caption}
                                               subTitle={componentConfig.viewState.subtitle}/> :
                                            <Chart
                                              aliasMap={aliasMap}
                                              metaData={metaData}
                                              data={data}
                                              componentConfig={componentConfig}
                                              chartType={componentConfig.type}
                                              isInverted={componentConfig.viewState.isInverted}
                                              onSelect={onSelectFilter}
                                            />
  }
  const RenderCom = comMap[componentConfig.configType]
  const comRef = useRef<{resize: () => void, clearSelection?: () => void}>()
  const {run: handleResize} = useDebounceFn(() => {
    comRef.current?.resize()
  }, {wait: 500})
  useEffect(() => {
    if (addingFilter) return
    comRef.current?.clearSelection?.()
  }, [addingFilter])

  return (
    <ResizeObserver onResize={handleResize}>
      <Spin spinning={loading} wrapperClassName='w-full h-full'>
        {error ? (
          // @ts-ignore
          <div>{error.messageChain}</div>
        ) : <RenderCom.type {...RenderCom.props} ref={comRef} />}
      </Spin>
    </ResizeObserver>
  )
}, (prevProps, nextProps) => {
  return prevProps.componentConfig === nextProps.componentConfig
    && prevProps.addingFilter === nextProps.addingFilter
    && prevProps.filterList === nextProps.filterList
})