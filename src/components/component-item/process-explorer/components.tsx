import {EdgeInfo, GraphInfo, NodeInfo, NodeType, StartEndNodeName} from "@/components/component-item/hooks";

type DirGraphProps = {
  data: GraphInfo
}
export function DirGraph({data}: DirGraphProps) {
  return (
    <svg viewBox={data.viewBox} className="w-full">
      <defs>
        <marker id="rem" fill="#ea4300" orient="auto" markerUnits="strokeWidth" refX="4" refY="0"
                viewBox="0 -3 6 6">
          <path d="M2,0 L0,-3 L6,0 L0,3 L2,0"/>
        </marker>
        <marker id="add" fill="#107c10" orient="auto" markerUnits="strokeWidth" refX="4" refY="0"
                viewBox="0 -3 6 6">
          <path d="M2,0 L0,-3 L6,0 L0,3 L2,0"/>
        </marker>
        <marker id="e-level-1" fill="#201f1e" orient="auto" markerUnits="userSpaceOnUse" refX="10" refY="0"
                viewBox="0 -8.5 15 17" markerHeight="17" markerWidth="17">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-1-sel" fill="#0563DB" orient="auto" markerUnits="userSpaceOnUse" refX="10" refY="0"
                viewBox="0 -8.5 15 17" markerHeight="17" markerWidth="17">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-1-opacity" fill="#201f1e" opacity="0.4" orient="auto" markerUnits="userSpaceOnUse"
                refX="10" refY="0" viewBox="0 -8.5 15 17" markerHeight="17" markerWidth="17">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-1-animate" fill="#e3008c" orient="auto" markerUnits="strokeWidth" refX="4" refY="0"
                viewBox="0 -3 6 6">
          <path d="M2,0 L0,-3 L6,0 L0,3 L2,0"/>
        </marker>
        <marker id="e-level-2" fill="#3b3a39" orient="auto" markerUnits="userSpaceOnUse" refX="9" refY="0"
                viewBox="0 -8.5 15 17" markerHeight="14" markerWidth="14">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-2-sel" fill="#0563DB" orient="auto" markerUnits="userSpaceOnUse" refX="9" refY="0"
                viewBox="0 -8.5 15 17" markerHeight="14" markerWidth="14">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-2-opacity" fill="#3b3a39" opacity="0.4" orient="auto" markerUnits="userSpaceOnUse"
                refX="9" refY="0" viewBox="0 -8.5 15 17" markerHeight="14" markerWidth="14">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-2-animate" fill="#e3008c" orient="auto" markerUnits="strokeWidth" refX="4" refY="0"
                viewBox="0 -3 6 6">
          <path d="M2,0 L0,-3 L6,0 L0,3 L2,0"/>
        </marker>
        <marker id="e-level-3" fill="#605e5c" orient="auto" markerUnits="userSpaceOnUse" refX="9" refY="0"
                viewBox="0 -8.5 15 17" markerHeight="14" markerWidth="14">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-3-sel" fill="#0563DB" orient="auto" markerUnits="userSpaceOnUse" refX="9" refY="0"
                viewBox="0 -8.5 15 17" markerHeight="14" markerWidth="14">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-3-opacity" fill="#605e5c" opacity="0.4" orient="auto" markerUnits="userSpaceOnUse"
                refX="9" refY="0" viewBox="0 -8.5 15 17" markerHeight="14" markerWidth="14">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-3-animate" fill="#e3008c" orient="auto" markerUnits="strokeWidth" refX="4" refY="0"
                viewBox="0 -3 6 6">
          <path d="M2,0 L0,-3 L6,0 L0,3 L2,0"/>
        </marker>
        <marker id="e-level-4" fill="#a19f9d" orient="auto" markerUnits="userSpaceOnUse" refX="7" refY="0"
                viewBox="0 -8.5 15 17" markerHeight="11" markerWidth="11">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-4-sel" fill="#0563DB" orient="auto" markerUnits="userSpaceOnUse" refX="7" refY="0"
                viewBox="0 -8.5 15 17" markerHeight="11" markerWidth="11">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-4-opacity" fill="#a19f9d" opacity="0.4" orient="auto" markerUnits="userSpaceOnUse"
                refX="7" refY="0" viewBox="0 -8.5 15 17" markerHeight="11" markerWidth="11">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-4-animate" fill="#e3008c" orient="auto" markerUnits="strokeWidth" refX="4" refY="0"
                viewBox="0 -3 6 6">
          <path d="M2,0 L0,-3 L6,0 L0,3 L2,0"/>
        </marker>
        <marker id="e-level-5" fill="#c8c6c4" orient="auto" markerUnits="userSpaceOnUse" refX="7" refY="0"
                viewBox="0 -8.5 15 17" markerHeight="11" markerWidth="11">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-5-sel" fill="#0563DB" orient="auto" markerUnits="userSpaceOnUse" refX="7" refY="0"
                viewBox="0 -8.5 15 17" markerHeight="11" markerWidth="11">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-5-opacity" fill="#c8c6c4" opacity="0.4" orient="auto" markerUnits="userSpaceOnUse"
                refX="7" refY="0" viewBox="0 -8.5 15 17" markerHeight="11" markerWidth="11">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-5-animate" fill="#e3008c" orient="auto" markerUnits="strokeWidth" refX="4" refY="0"
                viewBox="0 -3 6 6">
          <path d="M2,0 L0,-3 L6,0 L0,3 L2,0"/>
        </marker>
        <marker id="e-level-6" fill="#d2d0ce" orient="auto" markerUnits="userSpaceOnUse" refX="4" refY="0"
                viewBox="0 -8.5 15 17" markerHeight="8" markerWidth="8">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-6-sel" fill="#0563DB" orient="auto" markerUnits="userSpaceOnUse" refX="4" refY="0"
                viewBox="0 -8.5 15 17" markerHeight="8" markerWidth="8">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-6-opacity" fill="#d2d0ce" opacity="0.4" orient="auto" markerUnits="userSpaceOnUse"
                refX="4" refY="0" viewBox="0 -8.5 15 17" markerHeight="8" markerWidth="8">
          <path d="M4.18,0 L0,8.5 L15,0 L0,-8.5 L4.18,0"/>
        </marker>
        <marker id="e-level-6-animate" fill="#e3008c" orient="auto" markerUnits="strokeWidth" refX="4" refY="0"
                viewBox="0 -3 6 6">
          <path d="M2,0 L0,-3 L6,0 L0,3 L2,0"/>
        </marker>
        <circle id="level-1" r="12" cx="0" cy="0" fill="#DEEBFB"/>
        <circle id="level-2" r="11" cx="0" cy="0" fill="#BDD9FC"/>
        <circle id="level-3" r="10" cx="0" cy="0" fill="#9CC7FC"/>
        <circle id="level-4" r="9" cx="0" cy="0" fill="#7AB4FD"/>
        <circle id="level-5" r="8" cx="0" cy="0" fill="#56A0FE"/>
        <circle id="level-6" r="7" cx="0" cy="0" fill="#066ff5"/>
        <circle id="level-1-ani" strokeWidth="0" r="12"/>
        <circle id="level-2-ani" strokeWidth="0" r="11"/>
        <circle id="level-3-ani" strokeWidth="0" r="10"/>
        <circle id="level-4-ani" strokeWidth="0" r="9"/>
        <circle id="level-5-ani" strokeWidth="0" r="8"/>
        <circle id="level-6-ani" strokeWidth="0" r="7"/>
      </defs>
      <g>
        {data.edges.map(e => <Edge key={e.d} info={e}/>)}
      </g>
      <g>
        {data.nodes.map(n => n.type === NodeType.StartEnd ? (
          n.name === StartEndNodeName.Start ? <StartNode info={n}/> : <EndNode info={n}/>
        ) : <Node key={n.name} info={n}/>)}
      </g>
    </svg>
  )
}

type NodeProps = {
  info: NodeInfo
}
function Node({info}: NodeProps) {
  return (
    <g cursor="pointer" opacity="1">
      <rect fill="#f4f4f4" x={info.x! - 6} y={info.y! - 6} width={info.width! + 12} height="52px" rx="26" ry="26"
            opacity="0"/>
      <rect fill="black" filter="url(#shadow-6)" stroke="#e1dfdd" strokeWidth="1px" x={info.x} y={info.y} rx="20"
            ry="20" width={info.width} height="40px"/>
      <rect fill="#ffffff" fillRule="evenodd" stroke="#e1dfdd" strokeWidth="1px" x={info.x} y={info.y} rx="20"
            ry="20" width={info.width} height="40px"/>
      <path d={`M${info.x! + info.width! - 20} ${info.y! + 3} A 17 17 0 0 1 ${info.x! + info.width! - 4} ${info.y! + 20}`}
            stroke="#518700"
            strokeWidth="2px"
            fill="none"/>
      <use href={`#level-${info.level}`} transform={`translate(${info.x! + 20}, ${info.y! + 20})`}/>
      <text x={info.x! + 40} y={info.y! + 20} fontSize="16px" fontWeight="600" fill="#323130">
        {info.name}
      </text>
      <text x={info.x! + 40} y={info.y! + 35} fontSize="12px" fontWeight="400" fill="#605e5c">
        {info.measure}
      </text>
      <text x={info.x! + (info.width! - 50)} y={info.y! + 25} fontSize="12px" fontWeight="600" fill="#767678"
            opacity="1" aria-hidden="true">
        {info.percent}
      </text>
    </g>
  )
}
function StartNode({info}: NodeProps) {
  return (
    <g fill="transparent" opacity="1">
      <circle cx={info.x} cy={info.y} r="20" fill="#8CBD18" stroke="none" opacity="0.32"/>
      <circle cx={info.x} cy={info.y} r="14" fill="#8CBD18" stroke="none"/>
      <polygon transform={`translate(${info.x} ${info.y})`}
               points="-1.5,-5 -1.5,5 4.5,0" fill="transparent" stroke="white"
               strokeWidth="2px"/>
      <text x={info.x! + 30} y={info.y} fontWeight="600" fontSize="16px" fill="#323130">{info.name}</text>
      <text x={info.x! + 30} y={info.y! + 15} fontWeight="400" fontSize="12px" fill="#605e5c">{info.measure}</text>
    </g>
  )
}
function EndNode({info}: NodeProps) {
  return (
    <g fill="transparent" opacity="1">
      <circle cx={info.x} cy={info.y} r="20" fill="#ea4300" stroke="none" opacity="0.32"/>
      <circle cx={info.x} cy={info.y} r="14" fill="#ea4300" stroke="none"/>
      <rect x={info.x! - 4} y={info.y! - 4} height="8" width="8" fill="transparent" stroke="white" strokeWidth="2px"/>
      <text x={info.x! + 30} y={info.y} fontWeight="600" fontSize="16px" fill="#323130">{info.name}</text>
      <text x={info.x! + 30} y={info.y! + 15} fontWeight="400" fontSize="12px" fill="#605e5c">{info.measure}</text>
    </g>
  )
}

type EdgeProps = {
  info: EdgeInfo
}
function Edge({info}: EdgeProps) {
  return (
    <g id={`${info.from}-${info.to}`} markerEnd={`url(#e-level-${info.level})`}>
      <path
        d={info.d}
        fill="none" strokeWidth="7px" stroke="transparent"/>
      <path className=""
            d={info.d}
            stroke="#a19f9d"
            strokeWidth="5px"
            // strokeDasharray="5,5"
            opacity="1"
            fill="none"
      />
      <rect x={info.labelPos![0]}
            y={info.labelPos![1]}
            width="37.807952880859375"
            height="18"
            opacity="0.8"
            fill="white"
            stroke="none"
      />
      <text
            stroke="none"
            fontWeight="normal"
            fontSize="12px"
            dx={info.labelPos![0]}
            dy={info.labelPos![1]}
            fill="#605e5c"
      >
        {info.measure}
      </text>
    </g>
  )
}