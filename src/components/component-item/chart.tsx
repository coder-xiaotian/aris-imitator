import type {EChartsOption, EChartsType, ElementEvent} from "echarts";
// @ts-ignore
import abbreviate from 'number-abbreviate'
import * as echarts from 'echarts'
import type {CustomSeriesOption, SeriesOption} from 'echarts'
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {ChartDataResponse, ChartType, ComponentConfig} from "../../apis/typing";
import colors from "tailwindcss/colors";
import {getColData} from "@/components/component-config-drawer/utils";
import {XAXisOption, YAXisOption} from "echarts/types/dist/shared";
import {OptionEncode} from "echarts/types/src/util/types";

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
export type SelectFilterHandler = (keys: string[], names: string[], values: string[]) => void
type ChartProps = {
  chartType: `${ChartType}`,
  isInverted: boolean,
  onSelect: SelectFilterHandler,
  data: ChartDataResponse | undefined,
  componentConfig: ComponentConfig,
  aliasMap: any,
  metaData: any,
}
export default forwardRef(({aliasMap, metaData, data, chartType, onSelect, isInverted, componentConfig}: ChartProps, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const echartsInsRef = useRef<EChartsType>()
  useEffect(() => {
    if (!containerRef.current) return

    echartsInsRef.current = echarts.init(containerRef.current)
    return () => echartsInsRef.current!.dispose()
  }, [containerRef.current])

  const [chartOptions, setChartOptions] = useState<EChartsOption>({})
  useEffect(() => {
    if (!data) return

    const meta = {
      xNames: [] as string[],
      xKeys: [] as string[],
    }
    const dimensionRE = /x(\d)?/
    const dIndexs = data.headers.reduce((res, h) => {
      const match = dimensionRE.exec(h) as any[]
      if (match) {
        const i = match[1] ?? 0
        res.push(i)
        const d = componentConfig.requestState.dimensions?.[i]
        if (!d) return res

        const col = getColData(d.alias, aliasMap, metaData)
        meta.xNames[i] = col!.description
        meta.xKeys[i] = col!.key
      }
      return res
    }, [] as number[]) // headers中x轴数据列的索引列表
    let dataSource = data.rows
    if (componentConfig.type === ChartType.DIST && dIndexs.length) {
      // 分配图数据处理
      if (componentConfig.requestState.options!.type === 1) {
        // @ts-ignore
        dataSource = dataSource.map((cols, i) => {
          cols.push(dataSource[i+1] ? `${cols[dIndexs[0]]}-${dataSource[i+1]?.[dIndexs[0]]}` : `>=${cols[dIndexs[0]]}`)
          return cols
        })
      } else {
        // @ts-ignore
        dataSource = dataSource.map((cols) => {
          // @ts-ignore
          cols.push(cols[dIndexs[0]].to ? `${cols[dIndexs[0]].from}-${cols[dIndexs[0]].to}` : `>=${cols[dIndexs[0]].from}`)
          return cols
        })
      }
    } else {
      if (dIndexs.length) {
        // 将数据中的x轴数据拼接成一列放在最后一列
        // @ts-ignore
        dataSource = dataSource.map(cols => {
          let dName = cols[dIndexs[0]]
          for (let i = 1; i < dIndexs.length; i++) {
            dName += `-${cols[dIndexs[i]]}`
          }

          return [...cols, dName]
        })
      }
    }
    handleOptions([...data.headers, 'xData'], dataSource, componentConfig, meta)
    function handleOptions(headers: string[], dataSource: any[][] | undefined, config: ComponentConfig, meta: {xNames: string[], xKeys: string[]}) {
      const isPie = config.type === ChartType.PIE
      let xAxis: XAXisOption = {
        type: 'category',
        axisLabel: {
          rotate: 45,
          width: 50,
          // @ts-ignore
          overflow: 'truncate'
        },
        show: !isPie,
        name: meta.xNames.join(" / "),
        nameLocation: "middle",
        nameGap: 50,
      }
      const abbrFormatter = (value: number | string) => {
        return abbreviate(value)
      }
      let yAxis: YAXisOption = {
        type: 'value',
        axisLabel: {
          formatter: abbrFormatter,
        },
        show: !isPie
      }
      if (config.viewState.isInverted) {
        xAxis = {type: 'value', axisLabel: {formatter: abbrFormatter}, splitLine: {show: false}}
        yAxis = {
          type: 'category',
          name: meta.xNames.join(" / "),
          nameLocation: "middle",
        }
      }
      const opt: EChartsOption = {
        meta,
        title: {
          show: !!config.viewState.caption,
          text: config.viewState.caption,
          subtext: config.viewState.subtitle
        },
        xAxis,
        yAxis,
        tooltip: {
          trigger: isPie ? 'item' : 'axis',
          axisPointer: {
            type: 'shadow',
          }
        },
        legend: {
          type: 'scroll',
        },
        animationDurationUpdate: 1000,
        dataZoom: {
          type: "inside",
          start: 0,
          end: 100,
          orient: config.viewState.isInverted ? "vertical" : "horizontal",
          zoomOnMouseWheel: "ctrl",
          moveOnMouseMove: "ctrl",
          preventDefaultMouseMove: false,
        },
        series: Object.keys(config.viewState.measures).map((key, i) => {
          const viewMeasure = config.viewState.measures[key]
          const type = ((viewMeasure.chartType === "column" || viewMeasure.chartType === "line" || viewMeasure.chartType === "area")
              ? CHART_TYPE_MAP[viewMeasure.chartType] : undefined)
            || CHART_TYPE_MAP[config.type]
          const res: SeriesOption = {
            id: key,
            selectedMode: "multiple",
            select: {
              disabled: false
            },
            universalTransition: true
          }
          // 设置名称
          if (viewMeasure.useNameAsTitle) {
            const measureInfo = config.requestState.measureConfigs?.find(item => item.id === key)
            const colData = getColData(measureInfo!.alias, aliasMap, metaData)
            res.name = colData?.description
          } else {
            res.name = viewMeasure.displayName
          }

          res.type = type
          let encode: OptionEncode = {
            x: 'xData',
            y: `y${i}`,
          }
          if (config.viewState.isInverted) {
            encode = {
              x: `y${i}`,
              y: 'xData',
            }
          }
          if (isPie) {
            encode = {
              itemName: 'xData',
              value: `y${i}`
            }
            // @ts-ignore
            res.itemStyle = {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2
            }
            // @ts-ignore
            res.radius = ['30%', '70%']
          }
          // @ts-ignore
          res.encode = encode
          // @ts-ignore
          res.areaStyle = (viewMeasure.chartType === "area" || viewMeasure.chartType === "areaspline") ? {}
            : config.type === ChartType.AREA ? {} : undefined
          // @ts-ignore
          res.smooth = viewMeasure.chartType === "spline" || viewMeasure.chartType === "areaspline"
          return res
        }),
        dataset: {
          source: dataSource,
          dimensions: headers
        }
      }
      setChartOptions(opt)
    }
  }, [data, componentConfig.viewState, componentConfig.type])

  // 过滤器刷选逻辑
  useEffect(() => {
    const ins = echartsInsRef.current!

    function handleZrClick(e: ElementEvent) {
      // 点击事件不在第一个坐标系中，则不做响应
      if (!ins.containPixel("grid", [e.offsetX, e.offsetY])) return

      // @ts-ignore
      const ecModel = ins.getModel()
      const dAxis = ecModel.getComponent(isInverted ? "yAxis" : "xAxis")
      const [xIndex, yIndex] = ins.convertFromPixel({gridIndex: 0}, [e.offsetX, e.offsetY])
      const startIndex = isInverted ? yIndex : xIndex
      ins.setOption({
        series: calcBrushOption(startIndex, startIndex),
      })
      onSelect(ecModel.option.meta.xKeys, ecModel.option.meta.xNames, [dAxis.getCategories()[startIndex]])
    }
    function handleMouseOver({event}: any) {
      const canvas = event?.event.target as HTMLCanvasElement
      const dir = event?.target.name as "leftHandler" | "rightHandler"
      if (dir !== "leftHandler" && dir !== "rightHandler") {
        canvas.style.cursor = "default"
        return
      }

      if (dir === "leftHandler") {
        if (isInverted) {
          canvas.style.cursor = 'n-resize'
        } else {
          canvas.style.cursor = "w-resize"
        }
      } else {
        if (isInverted) {
          canvas.style.cursor = "s-resize"
        } else {
          canvas.style.cursor = "e-resize"
        }
      }
    }
    function handleMouseout({event}: any) {
      const canvas = event?.event.target as HTMLCanvasElement
      canvas.style.cursor = "default"
    }
    function handleMouseDown({event}: any) {
      const dir = event?.target.name as "leftHandler" | "rightHandler"
      if (dir !== "leftHandler" && dir !== "rightHandler") return

      // @ts-ignore
      let [startIndex, endIndex] = ins.getModel().queryComponents({mainType: "series", id: "filterSelector"})[0].option.sliderRange
      // @ts-ignore
      const ecModel = ins.getModel()
      const dAxis = ecModel.getComponent(isInverted ? "yAxis" : "xAxis")
      const bandWidth = dAxis.axis.getBandWidth()
      ins.setOption({
        series: calcBrushOption(startIndex, endIndex, dir)
      })

      const offsetXKey = isInverted ? "offsetY" : "offsetX"
      let startX = event![offsetXKey]
      let movementX: number, tmpStartIdx = startIndex, tmpEndIdx = endIndex
      const i = isInverted ? 1 : 0
      const categories = dAxis.getCategories()
      const judgeFn = isInverted ? () => tmpEndIdx > tmpStartIdx || (tmpEndIdx < 0 || tmpStartIdx >= categories.length)
        : () => tmpEndIdx < tmpStartIdx || (tmpStartIdx < 0 || tmpEndIdx >= categories.length)
      function handleMousemove(e: MouseEvent) {
        movementX = Math.abs(e[offsetXKey] - startX)
        if (movementX < (bandWidth / 2)) return

        const newIndex = ins.convertFromPixel({gridIndex: 0}, [e.offsetX, e.offsetY])[i]
        startX = startX + bandWidth * Math.ceil(movementX / bandWidth)
        if (dir === "leftHandler") {
          tmpStartIdx = newIndex
        } else {
          tmpEndIdx = newIndex
        }
        if (judgeFn()) return // 宽度已经是最小了，不能继续拖拽 or 到达grid边界，不能拖拽

        startIndex = tmpStartIdx
        endIndex = tmpEndIdx
        ins.setOption({
          series: calcBrushOption(startIndex, endIndex, dir)
        })
        const values = []
        if (isInverted) {
          for (let i = endIndex; i <= startIndex; i++) {
            values.push(categories[i])
          }
        } else {
          for (let i = startIndex; i <= endIndex; i++) {
            values.push(categories[i])
          }
        }
        onSelect(ecModel.option.meta.xKeys, ecModel.option.meta.xNames, values)
      }
      document.addEventListener("mousemove", handleMousemove)
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", handleMousemove)
        ins.setOption({
          series: calcBrushOption(startIndex, endIndex)
        })
      }, {once: true})
    }
    function handlePieSelect() {
      // @ts-ignore
      const ecModel = ins.getModel()
      const selectedMap = ecModel.getSeriesByIndex(0).option.selectedMap
      onSelect(ecModel.option.meta.xKeys, ecModel.option.meta.xNames, Object.keys(selectedMap).reduce((res, key) => {
        if (selectedMap[key]) {
          res.push(key)
        }
        return res
      }, [] as string[]))
    }
    if (chartType !== "pie" && chartType !== "grid") {
      ins.getZr().on("click", handleZrClick)
      ins.on("mouseover", {seriesId: "filterSelector"}, handleMouseOver)
      ins.on("mouseout", {seriesId: "filterSelector"}, handleMouseout)
      ins.on("mousedown", {seriesId: "filterSelector"}, handleMouseDown)
    } else if (chartType === "pie") {
      ins.on("selectchanged", handlePieSelect)
    }
    return () => {
      ins.getZr()?.off("click", handleZrClick)
      ins.off("mouseover", handleMouseOver)
      ins.off("mouseout", handleMouseout)
      ins.off("mousedown", handleMouseDown)
      ins.off("selectchanged", handlePieSelect)
    }
  }, [echartsInsRef.current, isInverted])
  function calcBrushOption(startIndex: number, endIndex: number, activeDir?: "leftHandler" | "rightHandler") {
    const judgeFn = isInverted ? (params: any) => params.dataIndex > startIndex || params.dataIndex < endIndex
      : (params: any) => params.dataIndex > endIndex || params.dataIndex < startIndex
    return {
      type: "custom",
      id: "filterSelector",
      sliderRange: [startIndex, endIndex],
      encode: {[isInverted ? 'y' : 'x']: "xData"},
      animation: activeDir !== "leftHandler",
      clip: true,
      tooltip: {
        show: false,
      },
      renderItem(params, api) {
        if (judgeFn(params)) return

        let bandWidth, startX, endX
        if (isInverted) {
          bandWidth = (api.size?.([1, 1]) as number[])[1]
          startX = api.coord([1, startIndex])[1]
          endX = api.coord([1, endIndex])[1]
        } else {
          bandWidth = (api.size?.([1]) as number[])[0]
          startX = api.coord([startIndex])[0]
          endX = api.coord([endIndex])[0]
        }
        const helfBandWidth = bandWidth / 2
        let x, y, width, height
        if (isInverted) {
          // @ts-ignore
          x = params.coordSys.x
          y = startX - helfBandWidth
          // @ts-ignore
          width = params.coordSys.width
          height = (endX + helfBandWidth) - y
        } else {
          // @ts-ignore
          x = startX - helfBandWidth, y = params.coordSys.y, width = (endX + helfBandWidth) - x, height = params.coordSys.height
        }
        return {
          id: "filterGroup",
          type: "group",
          x,
          y,
          width,
          height,
          emphasisDisabled: true,
          children: [{
            id: "range",
            type: "group",
            width,
            height,
            z2: 100,
            silent: true,
            children: [{
              type: "rect",
              shape: {
                width,
                height
              },
              style: {
                fill: "#EDF3FD"
              }
            }, {
              id: "leftBorder",
              type: "rect",
              z2: 100,
              shape: isInverted ? {
                width,
                height: 1
              } : {
                width: 1,
                height
              },
              style: {
                fill: "rgb(96, 94, 92)"
              }
            }, {
              id: "rightBorder",
              type: "rect",
              z2: 100,
              shape: isInverted ? {
                y: height,
                width,
                height: 1
              } : {
                x: width,
                width: 1,
                height: height
              },
              style: {
                fill: "rgb(96, 94, 92)"
              },
            }]
          }, {
            name: "leftHandler",
            type: "rect",
            z2: 100,
            shape: isInverted ? {
              x: width / 2 - 20,
              y: -8,
              width: 40,
              height: 8,
              r: [2, 2, 0, 0]
            } : {
              x: -8,
              y: height / 2 - 20,
              width: 8,
              height: 40,
              r: [2, 0, 0, 2]
            },
            style: {
              fill: activeDir === "leftHandler" ? colors.blue["500"] : "rgb(96, 94, 92)"
            },
          }, {
            name: "rightHandler",
            type: "rect",
            z2: 100,
            shape: isInverted ? {
              x: width / 2 - 20,
              y: height,
              width: 40,
              height: 8,
              r: [0, 0, 2, 2]
            } : {
              x: width,
              y: height / 2 - 20,
              width: 8,
              height: 40,
              r: [0, 2, 2, 0]
            },
            style: {
              fill: activeDir === "rightHandler" ? colors.blue["500"] : "rgb(96, 94, 92)",
            },
          }]
        }
      }
    } as CustomSeriesOption
  }

  useEffect(() => {
    echartsInsRef.current?.setOption(chartOptions, true)
  }, [echartsInsRef.current, chartOptions])
  useImperativeHandle(ref, () => ({
    resize: echartsInsRef.current?.resize,
    clearSelection: () => {
      const options = echartsInsRef.current?.getOption()
      // @ts-ignore
      echartsInsRef.current?.setOption?.({series: options.series.filter(s => s === "filterSelector")}, {replaceMerge: ["series"]})
    }
  }))

  return (
    <div ref={containerRef} className='w-full h-full' />
  )
})