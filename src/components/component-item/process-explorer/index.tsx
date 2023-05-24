import {useEffect, useRef, useState} from "react";
import {useProcessData} from "@/components/component-item/hooks";
import {ComponentConfig, FilterInfo} from "../../../apis/typing";
import Wrapper from "@/components/component-item/wrapper";
import SettingDrawser from "@/components/component-item/process-explorer/setting-drawser";

type ProcessExplorerProps = {
  componentConfig: ComponentConfig,
  aliasMap: any,
  metaData: any,
  filterList: FilterInfo[]
  addingFilter: boolean
}
export default ({filterList, addingFilter, metaData, aliasMap, componentConfig}: ProcessExplorerProps) => {
  const {data, loading} = useProcessData({filterList, addingFilter, metaData, aliasMap, componentConfig})

  const processDataRef = useRef()
  const nodeMapRef = useRef<{ [key: string]: any }>({})
  const edgeMapRef = useRef<{ [key: string]: any }>({})
  const nodeStepDataRef = useRef<any>()
  useEffect(() => {
    if (!data) return

    const {nodes, edges, commonPath} = data
    nodeMapRef.current = nodes.reduce((res, item) => {
      res[item.activity] = item
      return res
    }, {} as any)
    edgeMapRef.current = edges.reduce((res, item) => {
      res[`${item.from}->${item.to}`] = item
      return res
    }, {} as any)
  }, [data?.nodes, data?.edges, data?.commonPath])
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  const [isVariety, setIsVariety] = useState(false)

  return (
    <Wrapper loading={loading}>
      <svg>
        <g>
          {/* @ts-ignore */}
          {nodes.map(n => <Node key={n.label} label={n.label} data={n}/>)}
        </g>
      </svg>
      <SettingDrawser isVariety={isVariety}/>
    </Wrapper>
  )
}

type NodeProps = {
  data: {x: number, y: number, label: string}
}
function Node({data: {x, y, label}}: NodeProps) {
  return (
    <rect x={x} y={y}>{label}</rect>
  )
}

// @ts-ignore
function generateDotStr(nodes, edges) {
  return `digraph G {
    ${nodes
     // @ts-ignore
    .map((n) => {
      if (n.id === "StartNode") return "start [shape=circle]";
      else if (n.id === "EndNode") return "end [shape=circle]";
      return `${n.id} [shape=rect,width=4,height=1]`;
    })
    .join("\n")}
    ${edges.map((e: any) => `${e.from} -> ${e.to}`).join("\n")}
  }`;
}