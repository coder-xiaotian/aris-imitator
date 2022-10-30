import {PropsWithChildren, useContext, useState} from "react";
import ReactGridLayout, {Layout} from "react-grid-layout";
import {AliasMapping, ComponentConfig, DashBoardInfo} from "../../apis/typing";
import GridItem from "../../components/grid-item";
import 'react-grid-layout/css/styles.css'
import {useDebounceFn, useRequest} from "ahooks";
import request from '@/utils/client-request'
import DashboardLayout, {DashBoardContext} from "@/components/layouts/dashboard-layout";
import {useRouter} from "next/router";
import ComponentConfigDrawer from "@/components/component-config-drawer";
import ChartItem from "@/components/chart-item";
import {Spin} from "antd";
import ResizeObserver from "rc-resize-observer";

export type ConfigChangeHandler = (newChart: ComponentConfig, newAliasMap?: AliasMapping) => void
const DashBoard = (props: PropsWithChildren) => {
  // 是否编辑模式
  const {isEditMode, metaData} = useContext(DashBoardContext)
  const router = useRouter()
  const {aid, tab} = router.query
  const {data: dashboardData, mutate: setDashboardData, loading} = useRequest(async () => {
    const res = await request.get<any, DashBoardInfo>(`/api/projects/ky_1/analyses/${aid}/tabs/${tab}?locale=zh-CN&apiTag=22A0`)
    res.content = JSON.parse(res.content as any)
    return res
  }, {
    ready: Boolean(aid && tab && metaData),
    refreshDeps: [aid, tab]
  })
  const {run: updateDashboardDataReq} = useDebounceFn(async (dbData: DashBoardInfo) => {
    dbData.content = JSON.stringify(dbData.content) as any
    const res = await request.put<any, DashBoardInfo>(`/api/projects/ky_1/analyses/${aid}/tabs/${tab}?locale=zh-CN&apiTag=22A0`, dbData)
    res.content = JSON.parse(res.content as any)
    setDashboardData(res)
  }, {wait: 500})

  // 配置中的组件索引
  const [configingIndex, setConfigingIndex] = useState<number>(NaN)

  const charts = dashboardData?.content?.configurationState?.charts ?? []
  const aliasMap = dashboardData?.aliasMapping ?? {special: {}, normal: {}, script: {}}
  const usedAliases = dashboardData?.content.usedAliases ?? []
  const handleChangeConfig: ConfigChangeHandler = (newChart, newAliasMap) => {
    charts.splice(configingIndex, 1, {config: newChart, layout: charts[configingIndex].layout})
    if (newAliasMap) {
      dashboardData!.aliasMapping = newAliasMap
    }
    // 计算已使用的别名
    dashboardData!.content.usedAliases = charts.reduce((res, item) => {
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

    setDashboardData({
      ...dashboardData,
    } as DashBoardInfo)
    // 调接口，更新dashboard数据
    // updateDashboardDataReq(dashboardData)
  }
  function handleDragStop(layout: Layout[]) {
    layout.forEach(l => {
      charts[Number(l.i)].layout = l
    })
    // setDashboardData({...dashboardData!})
    // 调接口，更新dashboard数据
    // updateDashboardDataReq(dashboardData)
  }

  const [containerWidth, setContainerWidth] = useState<number>(0)
  return (
    <ResizeObserver onResize={size => setContainerWidth(size.width)}>
      <Spin wrapperClassName='w-full h-full' spinning={loading}>
        <ReactGridLayout
          width={!isNaN(configingIndex) ? containerWidth - 340 : containerWidth}
          cols={48}
          rowHeight={50}
          useCSSTransforms={true}
          isResizable={isEditMode}
          onDragStop={handleDragStop}
        >
          {charts.map((chart, i) => (
            <GridItem disabled={!isEditMode}
                      onConfig={() => setConfigingIndex(i)}
                      onDoubleClick={() => setConfigingIndex(i)}
                      key={i}
                      data-grid={{
                        ...chart.layout,
                        resizeHandles: ['se'],
                      }}
                      selected={configingIndex === i}
            >
              <ChartItem key={chart.config.requestState.id}
                         chartConfig={chart.config}
                         aliasMap={aliasMap}
                         metaData={metaData!}
              />
            </GridItem>
          ))}
        </ReactGridLayout>
        <ComponentConfigDrawer configing={charts[configingIndex]?.config}
                               aliasMap={aliasMap}
                               usedAliases={usedAliases}
                               onClose={() => setConfigingIndex(NaN)}
                               onChangeConfig={handleChangeConfig}
        />
      </Spin>
    </ResizeObserver>
  )
}

DashBoard.getLayout = DashboardLayout
export default DashBoard
