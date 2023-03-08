import {AliasMapping, ChartDataResponse, ComponentConfig} from "../../apis/typing";
import {FixedSizeList} from "react-window"
import {useEffect, useRef, useState} from "react";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";
import {MetaData} from "../../apis/metaInfo";
import {getColData} from "@/components/component-config-drawer/utils";

type TableProps = {
  data: ChartDataResponse<(string|number)[]> | undefined
  aliasMap: AliasMapping
  metaData: MetaData
  componentConfig: ComponentConfig
}
export default ({data, componentConfig, metaData, aliasMap}: TableProps) => {
  const listRef = useRef<HTMLDivElement>(null)
  const [listHeight, setListHeight] = useState(0)
  useEffect(() => {
    handleHeight()
    listRef.current?.addEventListener("resize", handleHeight)
    function handleHeight() {
      setListHeight(listRef.current?.clientHeight ?? 0)
    }
  }, [listRef.current])

  type SortInfo = {field: string, sort: "desc" | "asc"}
  const [sortInfo, setSortInfo] = useState<SortInfo>()
  const [dataRows, setDataRows] = useState(data?.rows ?? [])
  useEffect(() => {
    setDataRows(data?.rows ?? [])
    sortData(sortInfo, data?.rows ?? [])
  }, [data?.rows])
  function handleSort(headName: string) {
    let sInfo: SortInfo
    if (sortInfo?.field === headName && sortInfo.sort === "asc") {
      sInfo = {
        ...sortInfo,
        sort: "desc"
      }
      setSortInfo(sInfo)
    } else if (sortInfo?.field === headName && sortInfo.sort === "desc") {
      setSortInfo(undefined)
    } else {
      sInfo = {
        field: headName,
        sort: "asc"
      }
      setSortInfo(sInfo)
    }
    // @ts-ignore
    sortData(sInfo, dataRows)
  }
  function sortData(sortData: SortInfo | undefined, rows: (string|number)[][]) {
    if (!sortData) {
      setDataRows([...(data?.rows ?? [])])
    } else {
      const index = data!.headers.findIndex(h => h === sortData.field)
      const newArr = rows.sort((a, b) => {
        const itemA = a[index]
        const itemB = b[index]
        if (typeof itemA === "number" && typeof itemB === "number") {
          return sortData.sort === "asc" ? itemA - itemB : itemB - itemA
        } else if (typeof itemA === "string" && typeof itemB === "string") {
          return sortData.sort === "asc" ? itemA.localeCompare(itemB) : itemB.localeCompare(itemA)
        }
        return 0
      })

      setDataRows(newArr)
    }
  }

  function renderHeader(h: string) {
    const {colInfo} = getColInfo(h)
    const col = getColData(colInfo.alias, aliasMap, metaData)

    return (
      <div key={h} className="cursor-pointer truncate flex items-center p-2 border-r border-r-slate-200"
           onClick={() => handleSort(h)}
           title={col?.description}
      >
        {sortInfo?.field === h && sortInfo?.sort === "asc" && <ArrowUpOutlined className="!text-gray-400"/>}
        {sortInfo?.field === h && sortInfo?.sort === "desc" && <ArrowDownOutlined className="!text-gray-400"/>}
        <span className="truncate inline-block ml-1">{col?.description}</span>
      </div>
    )
  }
  function getGridTemplateColumns() {
    let str = ""
    console.log(componentConfig.viewState.dimensions)
    data?.headers.forEach(h => {
      const {colInfo, type} = getColInfo(h)
      if (type === "dimension") {
        str += `${componentConfig.viewState.dimensions[colInfo.id]?.cellSpan ?? 1}fr `
      } else {
        str += `${componentConfig.viewState.measures[colInfo.id]?.cellSpan ?? 1}fr `
      }
    })

    return str
  }
  function getColInfo(h: string) {
    const re = /(x|y)(\d)?/
    const [_, axis, index = 0] = re.exec(h) ?? []
    let colInfo, type
    if(axis === "x") {
      type = "dimension"
      colInfo = componentConfig.requestState.dimensions![index as number]
    } else {
      type === "measure"
      colInfo = componentConfig.requestState.measureConfigs![index as number]
    }

    return {
      colInfo,
      type
    }
  }
  return (
    <div className="flex-grow flex flex-col">
      <div style={{display: "grid", gridTemplateColumns: getGridTemplateColumns()}}
           className="border-y border-y-slate-200"
      >
        {data?.headers?.map(h => renderHeader(h))}
      </div>
      <FixedSizeList className="flex-grow overflow-auto !h-0"
                     outerRef={listRef}
                     itemCount={dataRows.length}
                     width="100%" height={listHeight} itemSize={30}>
        {({index: i, style}) => {
          const row = dataRows[i]
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