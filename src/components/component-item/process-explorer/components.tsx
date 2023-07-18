import {NodeInfo, NodeType} from "@/components/component-item/hooks";

type NodeProps = {
  info: NodeInfo
}

export function Node({info}: NodeProps) {
  return info.type === NodeType.StartEnd ? (
    <g fill="transparent" opacity="1">
      <circle cx={info.x} cy={info.y} r="20" fill="#8CBD18" stroke="none" opacity="0.32"/>
      <circle cx={info.x} cy={info.y} r="14" fill="#8CBD18" stroke="none"/>
      <polygon transform={`translate(${info.x} ${info.y})`}
               points="-1.5,-5 -1.5,5 4.5,0" fill="transparent" stroke="white"
               strokeWidth="2px"/>
      <text x={info.x! + 30} y={info.y} fontWeight="600" fontSize="16px" fill="#323130">{info.name}</text>
      <text x={info.x! + 30} y={info.y! + 15} fontWeight="400" fontSize="12px" fill="#605e5c">{info.measure}</text>
    </g>
  ) : (
    <g cursor="pointer" opacity="1">
      <rect fill="#f4f4f4" x={info.x} y={info.x} width="310.0817565917969px" height="52px" rx="26" ry="26"
            opacity="0"/>
      <rect fill="black" filter="url(#shadow-6)" stroke="#e1dfdd" strokeWidth="1px" x="298.625" y="111.725" rx="20"
            ry="20" width="298.0817565917969px" height="40px"/>
      <rect fill="#ffffff" fillRule="evenodd" stroke="#e1dfdd" strokeWidth="1px" x="298.625" y="111.725" rx="20"
            ry="20" width="298.0817565917969px" height="40px"/>
      <path d="M577.7067565917969 114.725 A 17 17 0 0 1 593.7067565917969 131.725" stroke="#518700" strokeWidth="2px"
            fill="none"/>
      <use href="#buck-2" fill="#56A0FE" transform="translate(317.625, 131.725)"/>
      <text x={info.x} y={info.y} fontSize="16px" fontWeight="600" fill="#323130">
        {info.name}
      </text>
      <text x="338.625" y="145.225" fontSize="12px" fontWeight="400" fill="#605e5c"
            aria-hidden="true">8.08k
      </text>
      <text x="581.7067565917969" y="135.725" textAnchor="end" fontSize="12px" fontWeight="600" fill="#767678"
            opacity="1" aria-hidden="true">58.0%
      </text>
    </g>
  )
}