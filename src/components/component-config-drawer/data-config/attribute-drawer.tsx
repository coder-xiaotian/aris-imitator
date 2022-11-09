import classNames from "classnames";
import {Button} from "antd";
import {
  CloseOutlined,
  DownOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  FieldTimeOutlined
} from "@ant-design/icons";
import {ReactElement, useContext, useEffect, useRef, useState} from "react";
import {DashBoardContext} from "@/components/layouts/dashboard-layout";
import {ColumnInfo, TableData} from "../../../apis/metaInfo";
import {Aggregation} from "../../../apis/typing";

const fieldIconMap: Record<string, ReactElement> = {
  'TEXT': <FieldStringOutlined/>,
  'LONG': <FieldNumberOutlined/>,
  'TIME': <FieldTimeOutlined/>,
  'TIMESPAN': <FieldNumberOutlined/>,
  "DOUBLE": <FieldNumberOutlined/>
}
type AttributeDrawerProps = {
  category: 'dimension' | 'measure' | undefined
  onClose: () => void
  onSelect: (col: ColumnInfo) => void
  attrMenus: AttrMenu[]
}
type AttrMenu = {
  type: string
  title: string
  subTitle: string
  children: ColumnInfo[]
}
export default ({category, attrMenus, onClose, onSelect}: AttributeDrawerProps) => {
  const [selectedAttrInfo, setSelectedAttrInfo] = useState<{col: ColumnInfo | undefined}>({} as any)
  function handleSelectAttr(col: ColumnInfo) {
    setSelectedAttrInfo({col})
  }
  function handleSelectAggMethod(method: Aggregation) {
    // todo 比率暂不处理
    if(method === 'ratio') return
    console.log({
      ...selectedAttrInfo.col!,
      aggregationConfig: {
        ...selectedAttrInfo.col!.aggregationConfig,
        defaultAggregation: method
      }
    })
    onSelect({
      ...selectedAttrInfo.col!,
      aggregationConfig: {
        ...selectedAttrInfo.col!.aggregationConfig,
        defaultAggregation: method
      }
    })
    setSelectedAttrInfo({col: undefined})
  }

  return (
    <div className={classNames('absolute top-0 left-0 z-0 flex flex-col -translate-x-full bg-gray-100' +
      ' w-[340px] h-full bg-white shadow-md', {
      'hidden': !category
    })}>
      <div className="flex justify-between items-center px-3 py-2">
        <span className='text-base font-medium'>模型</span>
        <Button type='text' icon={<CloseOutlined/>} onClick={() => {
          setSelectedAttrInfo({col: undefined})
          onClose()
        }}/>
      </div>
      <div className='overflow-auto flex-grow'>
        <div>
          {selectedAttrInfo.col ? (
            <>
              <div className='flex justify-start items-center pl-8 py-2 font-medium'>
                {fieldIconMap[selectedAttrInfo.col.type]}
                <span className='inline-block ml-2'>{selectedAttrInfo.col.description}</span>
              </div>
              {selectedAttrInfo.col.aggregationConfig.aggregations.map(agg => (
                <div className='cursor-pointer flex items-center pl-8 py-2 hover:bg-slate-200 transition-all border-t border-t-gray-200'
                     key={agg.key}
                     onClick={() => handleSelectAggMethod(agg.key)}
                >
                  {agg.description}
                </div>
              ))}
            </>
          )
            : attrMenus.map(menu => <Menu key={menu.title} item={menu} onClick={category === 'dimension' ? onSelect : handleSelectAttr}/>)}
        </div>
      </div>
      <div className='p-2 border-t border-t-slate-200'>
        {selectedAttrInfo.col ? (
          <Button.Group className='flex w-full'>
            <Button onClick={() => setSelectedAttrInfo({col: undefined})}>返回</Button>
            <Button onClick={() => {
              setSelectedAttrInfo({col: undefined})
              onClose()
            }} className='flex-grow !ml-2'>取消</Button>
          </Button.Group>
        ) : <Button type='primary' block onClick={onClose}>完成</Button>}
      </div>
    </div>
  )
}

function Menu({item, onClick}: {item: AttrMenu, onClick: (item: ColumnInfo) => void}) {
  const [collapse, setCollapse] = useState(false)

  return (
    <div>
      <div className='flex justify-between items-stretch border-y'>
        <div className='flex justify-center items-center w-8 py-2 hover:bg-slate-200' onClick={() => setCollapse(!collapse)}>
          <DownOutlined className={classNames('transition-all ease-in-out', {'-rotate-90': collapse})}/>
        </div>
        <div className='grow flex flex-col justify-center py-2'>
          <span className='text-slate-400 text-xs'>{item.subTitle}</span>
          <span>{item.title}</span>
        </div>
      </div>
      <ul className={classNames('mb-0 h-fit transition-all ease-in-out', {'overflow-hidden h-0': collapse})}>
        {item.children.map(child => (
          <li className="cursor-pointer flex items-center pl-8 py-2 hover:bg-slate-200 transition-all"
              key={child.key}
              onClick={() => onClick(child)}
          >
            {fieldIconMap[child.type]}
            <span className='inline-block ml-2'>{child.description}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}