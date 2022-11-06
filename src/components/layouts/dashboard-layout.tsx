import {Button, Spin, Switch} from "antd";
import {useRequest} from "ahooks";
import {AnalysisTabInfo} from "../../apis/typing";
import request from "@/utils/client-request";
import {createContext, ReactElement, useMemo, useState} from "react";
import {useRouter} from "next/router";
import classNames from "classnames";
import {MetaData} from "../../apis/metaInfo";
import {PlusOutlined} from "@ant-design/icons";

export const DashBoardContext = createContext<{
  isEditMode: boolean
  metaData: MetaData | undefined
  openAddCom: boolean
  closeAddCom: () => void
}>({} as any)
export default (page: ReactElement) => {
  const router = useRouter()
  const {aid, tab} = router.query
  const {data: tabs = [], loading: loadingTabs} = useRequest<AnalysisTabInfo[], []>(() => request.get(`/api/projects/ky_1/analyses/${aid}/tabs`), {
    ready: Boolean(aid),
    onSuccess(data) {
      router.push(`/analyses/${aid}?tab=${data?.[0].tabKey}`)
    }
  })
  const {data: metaData, loading: loadingMetaData} = useRequest<MetaData, []>(() => request.get("/api/dataSets/data/metaInfo?locale=zh-CN&apiTag=22A0"), {
    ready: Boolean(aid)
  })
  // dashboard是否正在编辑中
  const [isEditMode, setIsEditMode] = useState(true)
  const [openAddCom, setOpenAddCom] = useState(false)
  const dashboardValue = useMemo(() => ({
    isEditMode,
    metaData,
    openAddCom,
    closeAddCom() {setOpenAddCom(false)}
  }), [isEditMode, metaData, openAddCom])

  return (
    <Spin wrapperClassName='[&_.ant-spin-container]:flex [&_.ant-spin-container]:flex-col
                            [&_.ant-spin-container]:h-full w-full h-full bg-gray-200'
          spinning={loadingTabs || loadingMetaData}>
      <div className='shrink-0 relative z-10 bg-white w-full h-12 text-right shadow'>
        <div className='inline-flex flex-col justify-center items-center h-full px-2 border-x border-x-slate-200'>
          <Button className='p-2 hover:!bg-slate-100 text-center'
                  type='text'
                  icon={<PlusOutlined className='p-1 w-fit mx-auto !border !border-blue-500 !text-blue-500 rounded-sm'/>}
                  onClick={() => setOpenAddCom(true)}
          />
        </div>
        <Switch checkedChildren='编辑' unCheckedChildren='只读' checked={isEditMode} onChange={setIsEditMode} />
      </div>
      <div className='grow overflow-auto relative'>
        <DashBoardContext.Provider value={dashboardValue}>
          {page}
        </DashBoardContext.Provider>
      </div>
      <ul className='w-full h-8 m-0'>
        {tabs.map(item => <li key={item.tabKey} className={classNames('cursor-pointer inline-flex justify-center items-center\n' +
          '         h-full ml-2 px-2 hover:bg-white', {
          'border-b-4 border-b-sky-500': tab === item.tabKey
        })} onClick={() => router.push(`/analyses/${aid}?tab=${item.tabKey}`)}>{item.name}</li>)}
      </ul>
    </Spin>
  )
}