import {ChartDataResponse} from "../../apis/typing";
import {useRef, useState} from "react";

type TableProps = {
  data: ChartDataResponse | undefined
}
export default ({data}: TableProps) => {
  console.log(data)
  return (
    <div>
      <div style={{display: "grid", gridTemplateColumns: `repeat(${data?.headers?.length}, 1fr)`}}>
        {data?.headers?.map(h => (
          <span key={h} className="p-2 border-y border-y-slate-200 border-l border-l-slate-200 first:border-l-0">{h}</span>
        ))}
      </div>
      <div>
        {data?.rows?.map((row, i) => (
          <div key={i} style={{display: "grid", gridTemplateColumns: `repeat(${row?.length}, 1fr)`}}>
            {row.map((item, j) =>
              <span key={i + j} className="px-2 py-1 truncate" title={item as string}>{item as string}</span>)}
          </div>
        ))}
      </div>
    </div>
  )
}