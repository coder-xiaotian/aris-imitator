import * as echarts from 'echarts'
import type {EChartsOption, EChartsType} from "echarts";
import {forwardRef, useEffect, useImperativeHandle, useRef} from "react";
import {transform} from 'echarts-stat';

echarts.registerTransform(transform.histogram)
type ChartProps = {
  options: EChartsOption
}
export default forwardRef(({options}: ChartProps, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const echartsInsRef = useRef<EChartsType>()
  useEffect(() => {
    if (!containerRef.current) return

    echartsInsRef.current = echarts.init(containerRef.current)
    return () => echartsInsRef.current?.dispose()
  }, [containerRef.current])
  useEffect(() => {
    echartsInsRef.current?.setOption(options)
  }, [echartsInsRef.current, options])
  useImperativeHandle(ref, () => ({
    resize: echartsInsRef.current?.resize
  }))

  return (
    <div ref={containerRef} className='w-full h-full' />
  )
})