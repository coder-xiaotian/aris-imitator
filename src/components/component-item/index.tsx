import {AliasMapping, ComponentConfig, ComponentType, FilterInfo} from "../../apis/typing";
import {memo, useEffect, useRef} from 'react'
import {MetaData} from "../../apis/metaInfo";
import Chart, {SelectFilterHandler} from './chart'
import ResizeObserver from "rc-resize-observer";
import Table from "@/components/component-item/table";
import ProcessExplorer from "@/components/component-item/process-explorer";

type ComponentItemProps = {
  componentConfig: ComponentConfig
  aliasMap: AliasMapping
  metaData: MetaData
  addingFilter: boolean
  onSelectFilter: SelectFilterHandler
  filterList: FilterInfo[]
}
export default memo(({componentConfig, aliasMap, metaData, addingFilter, filterList, onSelectFilter}: ComponentItemProps) => {
  const comMap = {
    [ComponentType.CHART as string]: componentConfig.type === "grid" ?
      <Table
        filterList={filterList}
        addingFilter={addingFilter}
        aliasMap={aliasMap}
        metaData={metaData}
        componentConfig={componentConfig}
      /> :
      <Chart
        filterList={filterList}
        addingFilter={addingFilter}
        aliasMap={aliasMap}
        metaData={metaData}
        componentConfig={componentConfig}
        chartType={componentConfig.type}
        isInverted={componentConfig.viewState.isInverted}
        onSelect={onSelectFilter}
      />,
    [ComponentType.PROCESS as string]: <ProcessExplorer
      filterList={filterList}
      addingFilter={addingFilter}
      aliasMap={aliasMap}
      metaData={metaData}
      componentConfig={componentConfig}
    />
  }
  const renderCom = comMap[componentConfig.configType]

  const comRef = useRef<{resize: () => void, clearSelection?: () => void}>()
  useEffect(() => {
    if (addingFilter) return
    comRef.current?.clearSelection?.()
  }, [addingFilter])

  return (
    <ResizeObserver onResize={() => comRef.current?.resize?.()}>
      {() => <renderCom.type {...renderCom.props} ref={comRef} />}
    </ResizeObserver>
  )
}, (prevProps, nextProps) => {
  return prevProps.componentConfig === nextProps.componentConfig
    && prevProps.addingFilter === nextProps.addingFilter
    && prevProps.filterList === nextProps.filterList
})