import {useContext, useEffect, useRef, useState} from "react";
// @ts-ignore
import ReactGridLayout, {Layout, utils as ReactGridLayoutUtils} from "react-grid-layout";
import {AliasMapping, ChartType, ComponentConfig, DashBoardInfo, FilterInfo} from "../../../apis/typing";
import GridItem from "@/components/grid-item";
import 'react-grid-layout/css/styles.css'
import {useDebounceFn, useRequest} from "ahooks";
import request from '@/utils/client-request'
import DashboardLayout, {DashBoardContext} from "@/components/layouts/dashboard-layout";
import {useRouter} from "next/router";
import ComponentConfigDrawer from "@/components/component-config-drawer";
import ComponentItem from "@/components/component-item";
import {Spin} from "antd";
import ResizeObserver from "rc-resize-observer";
import AddComDrawer from "@/components/add-com-drawer";
import {v4 as uuid} from "uuid";
import produce from "immer";
import classNames from "classnames";

function getLayoutXY(layouts: Layout[], l: Layout) {
  l.x = 0;
  l.y = 0;
  let hasConflict = true;
  while (hasConflict) {
    hasConflict = ReactGridLayoutUtils.getFirstCollision(layouts, l);
    if (hasConflict && l.x + l.w + 1 > 48) {
      l.x = 0;
      l.y += 1;
    } else if (hasConflict) {
      l.x += 1;
    }
  }
  return l;
}
export type ConfigChangeHandler = (newChart: ComponentConfig, newAliasMap?: AliasMapping, usedAliases?: string[]) => void
const DashBoard = () => {
  // 是否编辑模式
  const {isEditMode, metaData, openAddCom, closeAddCom, filterList, setFilterList, setConfigingFilterId, configingFilterId} = useContext(DashBoardContext)
  const router = useRouter()
  const {projectKey, aid, tab} = router.query
  const {data: dashboardData, mutate: setDashboardData, loading} = useRequest(async () => {
    const res = await request.get<any, DashBoardInfo>(`/api/projects/${projectKey}/analyses/${aid}/tabs/${tab}?locale=zh-CN&apiTag=22A0`)
    res.content = JSON.parse(res.content as any)
    return res
  }, {
    ready: Boolean(aid && tab && metaData),
    refreshDeps: [aid, tab]
  })
  const {run: updateDashboardDataReq} = useDebounceFn(async (dbData: DashBoardInfo) => {
    dbData.content = JSON.stringify(dbData.content) as any
    const res = await request.put<any, DashBoardInfo>(`/api/projects/${projectKey}/analyses/${aid}/tabs/${tab}?locale=zh-CN&apiTag=22A0`, dbData)
    res.content = JSON.parse(res.content as any)
    setDashboardData(res)
  }, {wait: 500})

  // 配置中的组件索引
  const [configingIndex, setConfigingIndex] = useState<number>(NaN)
  const [scrollToIndex, setScrollToIndex] = useState<number>()

  const charts = dashboardData?.content?.configurationState?.charts ?? []
  const aliasMap = dashboardData?.aliasMapping ?? {special: {}, normal: {}, script: {}}
  const usedAliases = dashboardData?.content.usedAliases ?? []
  const handleChangeConfig: ConfigChangeHandler = (newChart, newAliasMap, usedAliases) => {
    setDashboardData(produce(dashboardData!, draft => {
      const charts = draft.content.configurationState.charts
      charts.splice(configingIndex, 1, {config: newChart, layout: charts[configingIndex].layout})
      if (newAliasMap) {
        draft!.aliasMapping = newAliasMap
      }
      if (usedAliases) {
        draft!.content.usedAliases = usedAliases
      }
      // 计算已使用的别名
      draft!.content.usedAliases = charts.reduce((res, item) => {
        if (item.config.requestState.dimensions) {
          res.push(...item.config.requestState.dimensions.map(d => d.alias))
        }
        if (item.config.requestState.measureConfigs) {
          res.push(...item.config.requestState.measureConfigs.map(m => m.alias))
        }
        // if (item.config.requestState.measureConfig) {
        //   res.push(item.config.requestState.measureConfig.alias)
        // }
        // if (item.config.requestState.selections) {
        //   res.push(...item.config.requestState.selections.map(s => s.alias))
        // }
        if (item.config.alias) {
          res.push(...Object.values(item.config.alias))
        }
        return res
      }, [] as string[])
    }))
    // 调接口，更新dashboard数据
    // updateDashboardDataReq(dashboardData)
  }
  function handleDragStop(layouts: Layout[]) {
    setDashboardData(produce(dashboardData!, draft => {
      layouts.forEach(l => {
        draft.content.configurationState.charts[Number(l.i)].layout = l
      })
    }))
    // 调接口，更新dashboard数据
    // updateDashboardDataReq(dashboardData)
  }
  function handleAddCom(type: `${ChartType}`) {
    const layouts = charts.map(c => c.layout)
    const id = uuid()
    const l = getLayoutXY(layouts, {w: 10, h: 4} as Layout)
    const newConfig: ComponentConfig = {
      configType: 0 as any,
      alias: {},
      requestState: {
        id,
        includeNullValues: true,
        options: type === ChartType.TIME ? {bucketInterval: 1, type: 0, timeUnit: 'months'} : undefined
      },
      type: type,
      viewState: {
        autoDimensionAxisTitle: true,
        caption: '',
        dimensions: {},
        measures: {},
        dimensionAxisTitle: '',
        hasSubtitle: false,
        isInverted: false,
        isStacked: false,
        legendPosition: 6,
        measureAxes: {
          primary: {
            autoAxisTitle: true,
            autoDataRange: true,
            autoZoom: true,
            axisTitle: "",
            showAbbreviateValues: true,
            showAxisLabels: true,
            showHorizontalLines: true,
          },
          secondary: {
            autoAxisTitle: true,
            autoDataRange: true,
            autoZoom: true,
            axisTitle: "",
            showAbbreviateValues: true,
            showAxisLabels: true,
            showHorizontalLines: true,
          }
        },
        showAbbreviateValues: true,
        showDataLabels: true,
        showDimensionAxisLabels: true,
        showLegend: "RESPONSIVELY",
        showVerticalLines: false,
        subtitle: ''
      }
    }

    setDashboardData(produce(dashboardData!, draft => {
      draft.content.configurationState.charts.push({config: newConfig, layout: l})
    }))
    closeAddCom()
    setScrollToIndex(charts.length)
    setConfigingIndex(charts.length)
  }
  function handleDeleteCom(i: number) {
    setDashboardData(produce(dashboardData!, draft => {
      draft.content.configurationState.charts.splice(i, 1)
    }))
    setConfigingIndex(NaN)
  }

  const handleSelectFilter = (compId: string, filterInfos: FilterInfo[]) => {
    setFilterList(draft => {
      let replaceIndexs: number[] = []
      for (let i = 0; i < draft.length; i++) {
        const item = draft[i]
        if (item.compId === compId && item.isTemp) {
          // @ts-ignore
          draft[i] = null
          replaceIndexs.push(i)
        }
      }


      filterInfos.forEach((v, i) => {
        if (i >= replaceIndexs.length) {
          draft.push(v)
        } else if (filterInfos.length === 0) {
          draft.splice(replaceIndexs[i], 1)
        } else {
          draft.splice(replaceIndexs[i], 1, v)
        }
      })
    })
    setConfigingFilterId(compId)
  }

  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [isOverflowHidden, setIsOverflowHidden] = useState(false)
  useEffect(() => {
    if (!isNaN(configingIndex) || openAddCom) {
      setIsOverflowHidden(true)
      setTimeout(() => {
        setIsOverflowHidden(false)
      }, 1000)
    }
  }, [configingIndex, openAddCom])
  const emptyListRef = useRef([]) // 不想每次都传新对象导致组件chart-item重新渲染
  return (
    <ResizeObserver onResize={size => {
      setContainerWidth(size.width)
    }}>
      <Spin wrapperClassName='w-full h-full' spinning={loading}>
        <ReactGridLayout
          width={!isNaN(configingIndex) || openAddCom ? containerWidth - 340 : containerWidth}
          cols={48}
          rowHeight={50}
          useCSSTransforms={true}
          isResizable={isEditMode}
          isDraggable={isEditMode}
          onDragStop={handleDragStop}
        >
          {charts.map((chart, i) => {
            const addingFilter = configingFilterId === chart.config.requestState.id

            return (
              <GridItem disabled={!isEditMode}
                        className={classNames({"overflow-hidden": isOverflowHidden})}
                        key={i}
                        data-grid={{
                          ...chart.layout,
                          resizeHandles: ['se'],
                        }}
                        title={chart.config.viewState.caption}
                        subTitle={chart.config.viewState.subtitle}
                        selected={configingIndex === i}
                        scrollIntoView={scrollToIndex === i}
                        onConfig={() => setConfigingIndex(i)}
                        onDoubleClick={() => isEditMode && setConfigingIndex(i)}
                        onDelete={() => handleDeleteCom(i)}
              >
                <ComponentItem key={chart.config.requestState.id}
                               componentConfig={chart.config}
                               aliasMap={aliasMap}
                               metaData={metaData!}
                               addingFilter={addingFilter}
                               onSelectFilter={(values) => handleSelectFilter(chart.config.requestState.id, values)}
                               filterList={addingFilter ? emptyListRef.current : filterList}
                />
              </GridItem>
            )
          })}
        </ReactGridLayout>
        <ComponentConfigDrawer open={!isNaN(configingIndex)}
                               configing={charts[configingIndex]?.config}
                               aliasMap={aliasMap}
                               usedAliases={usedAliases}
                               onClose={() => setConfigingIndex(NaN)}
                               onChangeConfig={handleChangeConfig}
        />
        <AddComDrawer open={openAddCom} onClose={closeAddCom} onAddCom={handleAddCom}/>
      </Spin>
    </ResizeObserver>
  )
}

DashBoard.getLayout = DashboardLayout
export default DashBoard
