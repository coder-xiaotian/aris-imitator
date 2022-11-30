import type {EChartsOption, EChartsType, GraphicComponentOption} from "echarts";
import * as echarts from 'echarts'
import {forwardRef, useEffect, useImperativeHandle, useRef} from "react";
import {ChartType} from "../../apis/typing";
import colors from "tailwindcss/colors";

export type SelectFilterHandler = (keys: string[], values: string[]) => void
type ChartProps = {
  options: EChartsOption,
  chartType: `${ChartType}`,
  isInverted: boolean,
  onSelect: SelectFilterHandler,
}
export default forwardRef(({options, chartType, onSelect, isInverted}: ChartProps, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const echartsInsRef = useRef<EChartsType>()
  function calcBrushOption(width: number, height: number, x: number, y: number, activeDir?: "leftHandler" | "rightHandler") {
    return {
      type: "group",
      x,
      y,
      width,
      height,
      children: [{
        id: "range",
        type: "group",
        width,
        height,
        z: 10,
        silent: true,
        children: [{
          type: "rect",
          shape: {
            width,
            height: height
          },
          style: {
            fill: "#EDF3FD"
          }
        }, {
          id: "leftBorder",
          type: "rect",
          z: 10,
          shape: {
            width: 1,
            height: height
          },
          style: {
            fill: "rgb(96, 94, 92)"
          }
        }, {
          id: "rightBorder",
          type: "rect",
          right: 0,
          z: 10,
          shape: {
            width: 1,
            height: height
          },
          style: {
            fill: "rgb(96, 94, 92)"
          },
        }]
      }, {
        id: "leftHandler",
        type: "rect",
        top: "middle",
        left: -8,
        z: 10,
        cursor: "ew-resize",
        shape: {
          width: 8,
          height: 40,
          r: [2, 0, 0, 2]
        },
        style: {
          fill: activeDir === "leftHandler" ? colors.blue["500"] : "rgb(96, 94, 92)"
        },
        info: {
          width,
          height,
          x,
          y
        },
      }, {
        id: "rightHandler",
        type: "rect",
        top: "middle",
        right: -8,
        z: 10,
        cursor: "ew-resize",
        shape: {
          width: 8,
          height: 40,
          r: [0, 2, 2, 0]
        },
        style: {
          fill: activeDir === "rightHandler" ? colors.blue["500"] : "rgb(96, 94, 92)",
        },
        info: {
          width,
          height,
          x,
          y
        },
      }]
    } as GraphicComponentOption
  }
  useEffect(() => {
    if (!containerRef.current) return

    const ins = echartsInsRef.current = echarts.init(containerRef.current)
    if (chartType === "column") {
      ins.getZr().on("click", e => {
        // 点击事件不在第一个坐标系中，则不做响应
        if (!ins.containPixel("grid", [e.offsetX, e.offsetY])) return

        // @ts-ignore
        const ecModel = ins.getModel()
        const dAxis = ecModel.getComponent(isInverted ? "yAxis" : "xAxis")
        const bandWidth = dAxis.axis.getBandWidth()
        const {height, y} = ecModel.getComponent("grid").coordinateSystem.getRect()
        const pixel = ins.convertFromPixel({gridIndex: 0}, [e.offsetX, e.offsetY])
        const [x] = ins.convertToPixel({gridIndex: 0}, pixel)
        ins.setOption({
          graphic: calcBrushOption(bandWidth, height, x - bandWidth / 2, y),
        })
        onSelect(ecModel.option.meta.xKeys, [dAxis.getCategories()[pixel[0]]])
      })
      ins.on("mousedown", "graphic", ({event: downEvent, info}) => {
        // @ts-ignore
        const ecModel = ins.getModel()
        const dAxis = ecModel.getComponent(isInverted ? "yAxis" : "xAxis")
        const bandWidth = dAxis.axis.getBandWidth()
        const dragId = String(downEvent?.target.id) as "leftHandler" | "rightHandler" | undefined
        ins.setOption({
          graphic: calcBrushOption(info.width, info.height, info.x, info.y, dragId)
        })

        const gridRect = ecModel.getComponent("grid").coordinateSystem.getRect()
        let startX = downEvent!.offsetX
        const isLeft = String(downEvent!.target.id) === "leftHandler"
        let movementX: number, addNum: number, tmpInfo = {...info}
        function handleMousemove(e: MouseEvent) {
          movementX = e.offsetX - startX
          if (Math.abs(movementX) < (bandWidth / 2)) return

          addNum = bandWidth * Math.ceil(movementX / bandWidth)
          startX += addNum
          if (isLeft) {
            tmpInfo.x += addNum
            tmpInfo.width -= addNum
          } else {
            tmpInfo.width += addNum
          }
          if (tmpInfo.width < bandWidth) return // 宽度已经是最小了，不能继续拖拽
          if (tmpInfo.x < gridRect.x || tmpInfo.x + tmpInfo.width > gridRect.x + gridRect.width) return // 到达grid边界，不能拖拽

          ins.setOption({
            graphic: calcBrushOption(tmpInfo.width, tmpInfo.height, tmpInfo.x, tmpInfo.y, dragId)
          })
          info.x = tmpInfo.x
          info.width = tmpInfo.width
          const startIndex = ins.convertFromPixel("xAxis", info.x)
          const endIndex = ins.convertFromPixel("xAxis", info.x + info.width)
          const values = []
          const categories = dAxis.getCategories()
          for (let i = startIndex; i <= endIndex; i++) {
            values.push(categories[i])
          }
          onSelect(ecModel.option.meta.xKeys, values)
        }
        document.addEventListener("mousemove", handleMousemove)
        document.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", handleMousemove)
          ins.setOption({
            graphic: calcBrushOption(info.width, info.height, info.x, info.y)
          })
        })
      })
    }

    return () => ins.dispose()
  }, [containerRef.current])
  useEffect(() => {
    echartsInsRef.current?.setOption(options)
  }, [echartsInsRef.current, options])
  useImperativeHandle(ref, () => ({
    resize: echartsInsRef.current?.resize,
    clearSelection: () => echartsInsRef.current?.setOption({graphic: {}})
  }))

  return (
    <div ref={containerRef} className='w-full h-full' />
  )
})