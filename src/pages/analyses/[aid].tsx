import {PropsWithChildren, useContext, useState} from "react";
import {Responsive, WidthProvider} from "react-grid-layout";
import {ComponentConfig, DashBoardInfo} from "../../apis/typing";
import GridItem from "../../components/grid-item";
import 'react-grid-layout/css/styles.css'
import {useRequest} from "ahooks";
import request from '@/utils/client-request'
import DashboardLayout, {DashBoardContext} from "@/components/layouts/dashboard-layout";
import {useRouter} from "next/router";
import ComponentConfigDrawer from "@/components/component-config";

const ResponsiveGridLayout = WidthProvider(Responsive)
const DashBoard = (props: PropsWithChildren) => {
  const router = useRouter()
  const {aid, tab} = router.query
  const {data: dashboardData} = useRequest(async () => {
    const res = await request.get<any, DashBoardInfo>(`/api/projects/ky_1/analyses/${aid}/tabs/${tab}?locale=zh-CN&apiTag=22A0`)
    res.content = JSON.parse(res.content as any)
    return res
  }, {
    ready: Boolean(aid && tab),
  })
  const charts = dashboardData?.content?.configurationState?.charts ?? []
  const aliasMap = dashboardData?.aliasMapping ?? {special: {}, normal: {}, script: {}}
  const [configing, setConfiging] = useState<ComponentConfig>()
  const {isEditing} = useContext(DashBoardContext)


  return (
    <>
      <ResponsiveGridLayout cols={{lg: 48, mg: 48}} rowHeight={50} useCSSTransforms={true} isResizable={isEditing}>
        {charts.map((chart, i) => (
          <GridItem disabled={!isEditing} onConfig={() => setConfiging(chart.config)} onDoubleClick={() => setConfiging(chart.config)} key={i} data-grid={{
            ...chart.layout,
            resizeHandles: ['se'],
          }}/>
        ))}
      </ResponsiveGridLayout>
      <ComponentConfigDrawer configing={configing} aliasMap={aliasMap} onClose={() => setConfiging(undefined)}/>
    </>
  )
}

DashBoard.getLayout = DashboardLayout
export default DashBoard