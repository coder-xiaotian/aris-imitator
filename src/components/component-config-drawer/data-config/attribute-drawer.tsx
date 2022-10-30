import classNames from "classnames";
import {Button} from "antd";
import {
  CloseOutlined,
  DownOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  FieldTimeOutlined
} from "@ant-design/icons";
import {ReactElement, useContext, useEffect, useState} from "react";
import {DashBoardContext} from "@/components/layouts/dashboard-layout";
import {ColumnInfo, TableData} from "../../../apis/metaInfo";

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
  return (
    <div className={classNames('absolute top-0 left-0 z-0 -translate-x-full bg-gray-100' +
      ' w-[340px] h-full bg-white shadow-md', {
      'hidden': !category
    })}>
      <div className="flex justify-between items-center px-3 py-2">
        <span className='text-base font-medium'>模型</span>
        <Button type='text' icon={<CloseOutlined/>} onClick={onClose}/>
      </div>
      <div className='overflow-auto h-full'>
        <div>
          {attrMenus.map(menu => <Menu key={menu.title} item={menu} onClick={onSelect}/>)}
        </div>
      </div>
    </div>
  )
}

function Menu({item, onClick}: {item: AttrMenu, onClick: (item: ColumnInfo) => void}) {
  const fieldIconMap: Record<string, ReactElement> = {
    'TEXT': <FieldStringOutlined/>,
    'LONG': <FieldNumberOutlined/>,
    'TIME': <FieldTimeOutlined/>,
    'TIMESPAN': <FieldNumberOutlined/>,
    "DOUBLE": <FieldNumberOutlined/>
  }

  return (
    <div className=''>
      <div className='flex justify-between items-stretch border-y'>
        <div className='flex justify-center items-center w-8 py-2 hover:bg-slate-200'>
          <DownOutlined/>
        </div>
        <div className='grow flex flex-col justify-center py-2'>
          <span className='text-slate-400 text-xs'>{item.subTitle}</span>
          <span>{item.title}</span>
        </div>
      </div>
      <ul>
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