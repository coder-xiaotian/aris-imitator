import {Button, Spin, Switch, Typography} from "antd";
import {useRequest} from "ahooks";
import {AnalysisTabInfo, FilterInfo, ProjectInfo} from "../../apis/typing";
import request from "@/utils/client-request";
import {createContext, Dispatch, ReactElement, SetStateAction, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import classNames from "classnames";
import {MetaData} from "../../apis/metaInfo";
import {CheckOutlined, CloseOutlined, PlusOutlined} from "@ant-design/icons";
import {Updater, useImmer} from "use-immer";
import ScrollPage from "@/components/layouts/scroll-page";

export const DashBoardContext = createContext<{
  isEditMode: boolean
  metaData: MetaData | undefined
  openAddCom: boolean
  closeAddCom: () => void
  filterList: FilterInfo[]
  setFilterList: Updater<FilterInfo[]>
  configingFilterId: string | undefined
  setConfigingFilterId: Dispatch<SetStateAction<string|undefined>>
  datasetId: string | undefined,
  projectKey: string | undefined,
}>({} as any)
export default (page: ReactElement) => {
  const [tip, setTip] = useState<string|null>("登陆中")
  const sseRef = useRef<EventSource>()
  useEffect(() => {
    if (sseRef.current) {
      return
    }

    sseRef.current = new EventSource("/api/check-token")
    sseRef.current.addEventListener("message", (e) => {
      setTip(e.data)
    })
    sseRef.current.addEventListener("close", () => {
      setTip(null)
      sseRef.current?.close()
    })
  }, [])

  const router = useRouter()
  const {projectKey, aid, tab} = router.query
  // 请求项目信息
  const {data: projectInfo} = useRequest<ProjectInfo, any>(() => request.get(`/api/projects/${projectKey}`), {
    ready: !!projectKey && !tip
  })
  // 请求tabs数据
  const {data: tabs, loading: loadingTabs} = useRequest<AnalysisTabInfo[], []>(() => request.get(`/api/projects/${projectKey}/analyses/${aid}/tabs`), {
    ready: !!aid && !!projectInfo && !tip,
    onSuccess(data) {
      if (tab) return
      router.push(`/${projectKey}/analyses/${aid}?tab=${data?.[0].tabKey}`)
    }
  })
  const {data: metaData, loading: loadingMetaData} = useRequest<MetaData, []>(() => request.get(`/api/dataSets/${projectInfo?.dataSetId}/metaInfo?locale=zh-CN&apiTag=230A`), {
    ready: !!projectInfo && !!tabs && !tip
  })
  // 过滤器数据
  const [filterList, setFilterList] = useImmer<FilterInfo[]>([])
  // dashboard是否正在编辑中
  const [isEditMode, setIsEditMode] = useState(true)
  const [openAddCom, setOpenAddCom] = useState(false)
  // 处于配置中的过滤器id
  const [configingFilterId, setConfigingFilterId] = useState<string>()
  const dashboardValue = {
    isEditMode,
    metaData,
    openAddCom,
    closeAddCom() {setOpenAddCom(false)},
    filterList,
    setFilterList,
    configingFilterId,
    setConfigingFilterId,
    datasetId: projectInfo?.dataSetId,
    projectKey: projectInfo?.projectKey
  }
  function handleFilterDisplay(item: FilterInfo) {
    if (item.type === "RangeFilter") {
      return `>= ${item.from?.value} ` + (item.to ? `< ${item.to?.value}` : "")
    } else {
      return item.values?.join(",")
    }
  }

  return (
    <Spin wrapperClassName='[&_.ant-spin-container]:flex [&_.ant-spin-container]:flex-col
                            [&_.ant-spin-container]:h-full w-full h-full bg-gray-200'
          spinning={loadingTabs || loadingMetaData || !!tip} tip={tip}>
      <div className='shrink-0 flex justify-between relative z-10 bg-white w-full h-12 shadow'>
        <ScrollPage>
          {filterList.map((item, i) => {
            const displayValue = handleFilterDisplay(item)
            return (
              <div key={i} className="inline-flex justify-between items-center h-full border-l border-l-slate-200 hover:bg-slate-50">
                <div className="grow flex flex-col justify-center h-full px-2 max-w-[280px]">
                  <span className="font-medium">{item.fieldName}</span>
                  <div className="inline-block">
                    <Typography.Text className="text-xs text-gray-500"
                                     ellipsis={{tooltip: {color: "#fff", overlayInnerStyle: {color: "#000"}, title: displayValue}}}
                    >{displayValue}</Typography.Text>
                  </div>
                </div>
                {item.isTemp ? (
                  <div className="flex items-center relative h-full">
                    <span className="absolute left-0 border-t-[7px] border-t-transparent border-l-[8px] border-l-white border-b-[7px] border-b-transparent" />
                    <div className="cursor-pointer inline-flex justify-center items-center w-8 h-full bg-green-500 hover:bg-green-600"
                         onClick={() => {
                           setFilterList(draft => {draft[i].isTemp = false})
                           setConfigingFilterId(undefined)
                         }}
                    >
                      <CheckOutlined className="!text-white"/>
                    </div>
                    <div className="cursor-pointer inline-flex justify-center items-center w-8 h-full bg-red-500 hover:bg-red-600"
                         onClick={() => setFilterList(draft => {
                           const [item] = draft.splice(i, 1)
                           if (draft.findIndex(o => o.compId === item.compId && o.isTemp) === -1) { // filterList已经没有改组件的临时过滤器了
                             setConfigingFilterId(undefined)
                           }
                         })}
                    >
                      <CloseOutlined className="!text-white"/>
                    </div>
                  </div>
                ) : (
                  <Button type="text"
                          size="small"
                          className="mr-1"
                          icon={<CloseOutlined className="!text-gray-600"/>}
                          onClick={() => setFilterList(draft => {draft.splice(i, 1)})}
                  />
                )}
              </div>
            )
          })}
        </ScrollPage>
        <div>
          <div className='inline-flex flex-col justify-center items-center h-full px-2 border-x border-x-slate-200'>
            <Button className='p-2 hover:!bg-slate-100 text-center'
                    type='text'
                    icon={<PlusOutlined className='p-1 w-fit mx-auto !border !border-blue-500 !text-blue-500 rounded-sm'/>}
                    onClick={() => setOpenAddCom(true)}
            />
          </div>
          <Switch checkedChildren='编辑' unCheckedChildren='只读' checked={isEditMode} onChange={setIsEditMode} />
        </div>
      </div>
      <div className='grow overflow-auto relative'>
        <DashBoardContext.Provider value={dashboardValue}>
          {page}
        </DashBoardContext.Provider>
      </div>
      <ul className='w-full h-8 m-0'>
        {tabs?.map(item => <li key={item.tabKey} className={classNames('cursor-pointer inline-flex justify-center items-center\n' +
          '         h-full ml-2 px-2 hover:bg-white', {
          'border-b-4 border-b-sky-500': tab === item.tabKey
        })} onClick={() => router.push(`/${projectKey}/analyses/${aid}?tab=${item.tabKey}`)}>{item.name}</li>)}
      </ul>
    </Spin>
  )
}