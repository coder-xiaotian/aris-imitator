import {Switch} from "antd";
import {useRequest} from "ahooks";
import {AnalysisTabInfo} from "../../apis/typing";
import request from "@/utils/client-request";
import {createContext, ReactElement, useMemo, useState} from "react";
import {useRouter} from "next/router";
import classNames from "classnames";
import {MetaData} from "../../apis/metaInfo";

export const DashBoardContext = createContext<{
  isEditing: boolean
  metaData: MetaData | undefined
}>({} as any)
export default (page: ReactElement) => {
  const router = useRouter()
  const {aid, tab} = router.query
  const {data: tabs = []} = useRequest<AnalysisTabInfo[], []>(() => request.get(`/api/projects/ky_1/analyses/${aid}/tabs`), {
    ready: Boolean(aid),
    onSuccess(data) {
      router.push(`/analyses/${aid}?tab=${data?.[0].tabKey}`)
    }
  })
  const {data: metaData} = useRequest<MetaData, []>(() => request.get("/api/dataSets/data/metaInfo?locale=zh-CN&apiTag=22A0"))
  const [isEditing, setIsEditing] = useState(true)
  const dashboardValue = useMemo(() => ({
    isEditing,
    metaData
  }), [isEditing, metaData])

  return (
    <div className='flex flex-col w-full h-full bg-gray-200'>
      <div className='relative z-10 bg-white w-full h-8 text-right shadow'>
        <Switch checkedChildren='编辑' unCheckedChildren='只读' checked={isEditing} onChange={setIsEditing}></Switch>
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
    </div>
  )
}