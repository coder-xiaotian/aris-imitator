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
}
type AttrMenu = {
  type: string
  title: string
  subTitle: string
  children: ColumnInfo[]
}
export default ({category, onClose}: AttributeDrawerProps) => {
  const {metaData} = useContext(DashBoardContext)
  const [menus, setMenus] = useState<AttrMenu[]>([])
  useEffect(() => {
    if (!metaData) return

    function getMenus(tableData: TableData, prevTitles: string[] = [], menuList: any[] = []) {
      menuList.push({
        type: tableData.tableInfo.type,
        title: tableData.tableInfo.name,
        subTitle: prevTitles.join('/'),
        children: tableData.columns.filter(col => !col.isInternal)
      })
      for(let item of tableData.children) {
        getMenus(item, [...prevTitles, tableData.tableInfo.name], menuList)
      }

      return menuList
    }
    setMenus(getMenus(metaData.rootTable))
  }, [metaData])
  console.log(metaData, menus)

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
          {menus.map(menu => <Menu key={menu.title} item={menu}/>)}
        </div>
      </div>
    </div>
  )
}

function Menu({item}: {item: AttrMenu}) {
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
              key={child.key}>
            {fieldIconMap[child.type]}
            <span className='inline-block ml-2'>{child.description}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}