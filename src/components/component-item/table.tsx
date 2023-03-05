import {ChartDataResponse} from "../../apis/typing";
import {FixedSizeList} from "react-window"
import {useEffect, useRef, useState} from "react";

type TableProps = {
  data: ChartDataResponse | undefined
}
export default ({data}: TableProps) => {
  const listRef = useRef<HTMLDivElement>(null)
  const [listHeight, setListHeight] = useState(0)
  useEffect(() => {
    handleHeight()
    listRef.current?.addEventListener("resize", handleHeight)
    function handleHeight() {
      setListHeight(listRef.current?.clientHeight ?? 0)
    }
  }, [listRef.current])

  return (
    <div className="flex-grow flex flex-col">
      <div style={{display: "grid", gridTemplateColumns: `repeat(${data?.headers?.length}, 1fr)`}}
           className="border-y border-y-slate-200"
      >
        {data?.headers?.map(h => (
          <span key={h} className="p-2 border-r border-r-slate-200">{h}</span>
        ))}
      </div>
      <FixedSizeList className="flex-grow overflow-auto !h-0"
                     outerRef={listRef}
                     itemCount={data?.rows.length ?? 0}
                     width="100%" height={listHeight} itemSize={30}>
        {({index: i, style}) => {
          const row = data!.rows[i]
          return (
            <div key={i} style={{display: "grid", gridTemplateColumns: `repeat(${row?.length}, 1fr)`, ...style}}>
              {row.map((item, j) =>
                <span key={i + j} className="px-2 py-1 truncate" title={item as string}>{item as string}</span>)}
            </div>
          )
        }}
      </FixedSizeList>
    </div>
  )
}