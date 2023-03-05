import {ChartDataResponse} from "../../apis/typing";
import {FixedSizeList} from "react-window"
import {useEffect, useRef, useState} from "react";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";

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

  const [sortInfo, setSortInfo] = useState<{field: string, sort: "desc" | "asc"}>()
  function handleSort(headName: string) {
    if (sortInfo?.field === headName && sortInfo.sort === "asc") {
      setSortInfo({
        ...sortInfo,
        sort: "desc"
      })
    } else if (sortInfo?.field === headName && sortInfo.sort === "desc") {
      setSortInfo(undefined)
    } else {
      setSortInfo({
        field: headName,
        sort: "asc"
      })
    }
  }

  return (
    <div className="flex-grow flex flex-col">
      <div style={{display: "grid", gridTemplateColumns: `repeat(${data?.headers?.length}, 1fr)`}}
           className="border-y border-y-slate-200"
      >
        {data?.headers?.map(h => (
          <div key={h} className="cursor-pointer flex items-center p-2 border-r border-r-slate-200"
               onClick={() => handleSort(h)}
          >
            {sortInfo?.field === h && sortInfo.sort === "asc" && <ArrowUpOutlined className="!text-gray-400"/>}
            {sortInfo?.field === h && sortInfo.sort === "desc" && <ArrowDownOutlined className="!text-gray-400"/>}
            <span className="inline-block ml-1">{h}</span>
          </div>
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