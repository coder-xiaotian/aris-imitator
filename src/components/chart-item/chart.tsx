import type {EChartsOption, EChartsType, ElementEvent} from "echarts";
import * as echarts from 'echarts'
import {CustomSeriesOption} from 'echarts'
import {forwardRef, useEffect, useImperativeHandle, useRef} from "react";
import {ChartType} from "../../apis/typing";
import colors from "tailwindcss/colors";

export type SelectFilterHandler = (keys: string[], names: string[], values: string[]) => void
type ChartProps = {
  options: EChartsOption,
  chartType: `${ChartType}`,
  isInverted: boolean,
  onSelect: SelectFilterHandler,
}
export default forwardRef(({options, chartType, onSelect, isInverted}: ChartProps, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const echartsInsRef = useRef<EChartsType>()
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
    if (!containerRef.current) return

    echartsInsRef.current = echarts.init(containerRef.current)
    return () => echartsInsRef.current!.dispose()
  }, [containerRef.current])

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

  useEffect(() => {
    echartsInsRef.current?.setOption(options, true)
  }, [echartsInsRef.current, options])
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