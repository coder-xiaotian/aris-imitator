import {
  AliasMapping,
  ChartDataResponse,
  ChartType,
  ComponentConfig,
  ComponentRequestInfo,
  ComponentType
} from "../../apis/typing";
import {memo, useEffect, useRef, useState} from 'react'
import {getColData} from "@/components/component-config-drawer/utils";
import {useDebounceFn, useRequest} from "ahooks";
import {Spin} from "antd";
import {MetaData} from "../../apis/metaInfo";
import Chart from './chart'
import {EChartsOption, SeriesOption} from "echarts";
import request from '@/utils/client-request'
import ResizeObserver from "rc-resize-observer";
import {XAXisOption, YAXisOption} from "echarts/types/dist/shared";
// @ts-ignore
import abbreviate from 'number-abbreviate'

type ChartProps = {
  chartConfig: ComponentConfig
  aliasMap: AliasMapping,
  metaData: MetaData
}
const CHART_TYPE_MAP = {
  [ChartType.BAR]: 'bar' as const,
  [ChartType.PIE]: 'pie' as const,
  [ChartType.LINE]: 'line' as const,
  [ChartType.DIST]: 'bar' as const,
  [ChartType.TIME]: 'line' as const,
  [ChartType.AREA]: 'line' as const,
  [ChartType.GRID]: 'line' as const,
  [ChartType.SINGLE_KPI]: 'line' as const,
}
export default memo(({chartConfig, aliasMap, metaData}: ChartProps) => {
  // 获取图表的数据
  const {data, loading} = useRequest(() => request.post<any, ChartDataResponse, ComponentRequestInfo>('/api/dataSets/data/query/simple', {
    considerDistinct: false,
    includeNullValues: chartConfig.requestState.includeNullValues,
    size: 4000,
    sortCriteria: [],
    filterList: {
      type: 'FilterList',
      filters: [],
      mode: 'AND'
    },
    selections: [...chartConfig.requestState.dimensions?.map((d, i) => {
      const colData = getColData(d.alias, aliasMap, metaData)

      return {
        type: chartConfig.type !== ChartType.DIST && chartConfig.type !== ChartType.TIME ? 'Standard' as const : 'Distribution' as const,
        key: colData!.key,
        asColumn: `x${i}`,
        // todo 暂时写死 {type: "timeDistributionConfig", interval: 1, timeUnit: "months"}
        config: chartConfig.type === ChartType.TIME ? {type: "timeDistributionConfig", interval: 1, timeUnit: "months"} : undefined as any
      }
    }) ?? [], ...chartConfig.requestState.measureConfigs?.map((m, i) => {
      const colData = getColData(m.alias, aliasMap, metaData)
      const type = /*chartConfig.type !== ChartType.DIST && chartConfig.type !== ChartType.TIME ?*/
        m.aggregation === 'countDistinct' && m.granularities !== 'noTransformation' ? 'CountDistinctDate' as const : 'Agg' as const
          // : 'Distribution' as const

      return {
        type,
        key: colData!.key,
        asColumn: `y${i}`,
        aggregation: m.aggregation,
        granularities: m.granularities !== 'noTransformation' ? m.granularities : undefined
      }
    }) ?? []]
  }), {
    refreshDeps: [chartConfig.requestState],
    debounceWait: 500
  })

  // 根据获取的数据和配置组装echarts的options
  const [chartOptions, setChartOptions] = useState<EChartsOption>({})
  function handleOptions(headers: string[], dataSource: any[][] | undefined, config: ComponentConfig) {
    let xAxis: XAXisOption = {
      type: 'category',
      axisLabel: {
        rotate: 45,
        width: 50,
        // @ts-ignore
        overflow: 'truncate'
      },
    }
    const abbrFormatter = (value: number | string) => {
      return abbreviate(value)
    }
    let yAxis: YAXisOption = {
      type: 'value',
      axisLabel: {
        formatter: abbrFormatter,
      }
    }
    if (config.viewState.isInverted) {
      xAxis = {type: 'value', axisLabel: {formatter: abbrFormatter}}
      yAxis = {type: 'category'}
    }
    const opt: EChartsOption = {
      title: {
        show: !!config.viewState.caption,
        text: config.viewState.caption,
        subtext: config.viewState.subtitle
      },
      xAxis,
      yAxis,
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        bottom: 0
      },
      series: Object.keys(config.viewState.measures).map((key, i) => {
        const viewMeasure = config.viewState.measures[key]
        const type = CHART_TYPE_MAP[viewMeasure.chartType] || CHART_TYPE_MAP[config.type]
        const res: SeriesOption = {}
        // 设置名称
        if (viewMeasure.useNameAsTitle) {
          const measureInfo = config.requestState.measureConfigs?.find(item => item.id === key)
          const colData = getColData(measureInfo!.alias, aliasMap, metaData)
          res.name = colData?.description
        } else {
          res.name = viewMeasure.displayName
        }

        res.type = type
        let encode = {
          x: 'xData',
          y: `y${i}`,
        }
        if (config.viewState.isInverted) {
          encode = {
            x: `y${i}`,
            y: 'xData',
          }
        }
        // @ts-ignore
        res.encode = encode
        // @ts-ignore
        res.areaStyle = viewMeasure.chartType === ChartType.AREA ? {}
                          : config.type === ChartType.AREA ? {} : undefined
        return res
      }),
      dataset: {
        source: dataSource,
        dimensions: headers
      }
    }
    setChartOptions(opt)
  }
  const handleDataMap = {
    [ComponentType.CHART as string]: {
      [ChartType.LINE as string]: handleOptions,
      [ChartType.BAR as string]: handleOptions,
      [ChartType.AREA as string]: handleOptions,
      [ChartType.TIME as string]: handleOptions,
    }
  }
  useEffect(() => {
    const dIndexs = data?.headers.reduce((res, h, i) => {
      if (h.includes('x')) {
        res.push(i)
      }
      return res
    }, [] as number[]) ?? [] // headers中x轴数据列的索引列表
    let dataSource = data?.rows ?? []
    if (dIndexs.length) {
      // 将数据中的x轴数据拼接成一列放在最后一列
      dataSource = dataSource.map(cols => {
        let dName = cols[dIndexs[0]]
        for (let i = 1; i < dIndexs.length; i++) {
          dName += `-${cols[dIndexs[i]]}`
        }

        return [...cols, dName]
      })
    }
    handleDataMap[chartConfig.configType][chartConfig.type]([...data?.headers ?? [], 'xData'], dataSource, chartConfig)
  }, [data, chartConfig.viewState])

  const comMap = {
    [ComponentType.CHART as string]: <Chart options={chartOptions}/>
  }
  const RenderCom = comMap[chartConfig.configType]
  const comRef = useRef<{resize: () => void}>()
  const {run: handleResize} = useDebounceFn(() => {
    comRef.current?.resize()
  }, {wait: 500})

  return (
    <ResizeObserver onResize={handleResize}>
      <Spin spinning={loading} wrapperClassName='w-full h-full'>
        <RenderCom.type {...RenderCom.props} ref={comRef} />
      </Spin>
    </ResizeObserver>
  )
}, (prevProps, nextProps) => {
  return prevProps.chartConfig === nextProps.chartConfig
})