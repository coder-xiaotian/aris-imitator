import {getColData} from "@/components/component-config-drawer/utils";
import {Button, Popover, Tooltip} from "antd";
import {ColumnInfo, ColumnType, MetaData} from "../../../apis/metaInfo";
import {DeleteOutlined, DownOutlined, FunctionOutlined} from "@ant-design/icons";
import {Aggregation, AliasMapping, AttrConfig} from "../../../apis/typing";
import classNames from "classnames";
import moment from "moment";
import {useState} from "react";

export type AggMethodInfo = {
  key: Aggregation
  description: string
}
type AttrItemProps = {
  isDimension: boolean
  aliasMap: AliasMapping
  metaData: MetaData | undefined
  attrInfo: AttrConfig
  onDelete: () => void
  onSelectGranularity: (value: any) => void
  onSelectAgg?: (curAgg: AggMethodInfo, colInfo: ColumnInfo) => void
}
export default ({isDimension, attrInfo, aliasMap, metaData, onDelete, onSelectGranularity, onSelectAgg}: AttrItemProps) => {
  const col = getColData(attrInfo.alias, aliasMap, metaData)
  let text = <span className='font-medium'>{col?.description}</span>
  const aggInfo = col?.aggregationConfig.aggregations.find(agg => agg.key === attrInfo.aggregation)
  if (!isDimension) {
    text = (
      <>
        <span className='text-gray-500'>{aggInfo?.description}</span>
        (<span className='font-medium'>{col?.description}</span>)
      </>
    )
  }

  return (
    <Tooltip key={attrInfo.id} color='white' overlayInnerStyle={{color: 'black'}} placement='left'
             title={(
               <span className='!text-gray-500 !text-thin'>
                 {text}
                 {`(${ColumnType[col!.valueCalculationType]})`}
               </span>
             )}
    >
      <div className='group flex justify-between items-center my-1 px-2 hover:bg-slate-100 transition-all'>
        <span>{text}</span>
        <Button.Group>
          <Button className='!invisible'/>
          <GranularitiesPopover attrInfo={attrInfo} onSelect={onSelectGranularity}/>
          {!isDimension && (
            <Button className='!hidden group-hover:!inline-block'
                    type='text'
                    icon={<FunctionOutlined/>}
                    onClick={() => onSelectAgg?.(aggInfo!, col!)}
            />
          )}
          <Button className='!hidden group-hover:!inline-block'
                  type='text'
                  icon={<DeleteOutlined className='hover:!text-red-400'/>}
                  onClick={onDelete}
          />
        </Button.Group>
      </div>
    </Tooltip>
  )
}

type GranularitiesPopoverProps = {
  attrInfo: AttrConfig
  onSelect: (value: any) => void
}
function GranularitiesPopover({attrInfo, onSelect}: GranularitiesPopoverProps) {
  const now = moment()
  const granularityOptions = [{
    label: '秒',
    value: ["SECONDS", "MINUTES", "HOUR_OF_DAY", "DAY_OF_MONTH", "MONTH_OF_YEAR", "YEARS"],
    eg: now.format('YYYY/MM/DD HH:mm:ss')
  }, {
    label: '分钟',
    value: ["MINUTES", "HOUR_OF_DAY", "DAY_OF_MONTH", "MONTH_OF_YEAR", "YEARS"],
    eg: now.format('YYYY/MM/DD HH:mm')
  }, {
    label: '小时',
    value: ["HOUR_OF_DAY", "DAY_OF_MONTH", "MONTH_OF_YEAR", "YEARS"],
    eg: now.format('YYYY/MM/DD HH')
  }, {
    label: '天',
    value: ["DAY_OF_MONTH", "MONTH_OF_YEAR", "YEARS"],
    eg: now.format('YYYY/MM/DD')
  }, {
    label: '周',
    value: ["WEEK_OF_YEAR", "YEARS"],
    eg: now.format('YYYY/MM/DD')
  }, {
    label: '月',
    value: ["MONTH_OF_YEAR", "YEARS"],
    eg: now.format('MM/YYYY')
  }, {
    label: '年',
    value: ["YEARS"],
    eg: now.format('YYYY')
  }, {
    label: '日小时',
    value: ["HOUR_OF_DAY"],
    eg: now.format('HH')
  }, {
    label: '星期几',
    value: ["DAY_OF_WEEK"],
    eg: now.format('dddd')
  }, {
    label: '月日期',
    value: ["DAY_OF_MONTH"],
    eg: now.format('DD') + '日'
  }, {
    label: '年日期',
    value: ["DAY_OF_YEAR"],
    eg: now.format('MMMMDD') + '日'
  }, {
    label: '年周',
    value: ["WEEK_OF_YEAR"],
    eg: now.format('W')
  }, {
    label: '年月份',
    value: ["MONTH_OF_YEAR"],
    eg: now.format('MMMM')
  }]

  const [open, setOpen] = useState(false)
  function handleSelect(value: any) {
    onSelect(value)
    setOpen(false)
  }

  return (
    <Popover open={open} overlayClassName='!p-0 [&_.ant-popover-arrow]:hidden'
             onOpenChange={(v) => {
               if (v) return
               setOpen(v)
             }}
             content={(
                <div>
                  <div className='p-2 text-blue-500'>粒度</div>
                  <div className={classNames('cursor-pointer flex justify-between items-center w-[316px] px-2 py-1 hover:bg-slate-50', {
                         'bg-slate-100': attrInfo.granularities === 'noTransformation'
                       })}
                       onClick={() => handleSelect('noTransformation')}
                  >
                    <span>无聚集</span>
                  </div>
                  {granularityOptions.map(item => (
                    <div key={item.label}
                         className={classNames('cursor-pointer flex justify-between items-center w-[316px] px-2 py-1 hover:bg-slate-50', {
                           'bg-slate-100': item.value.join(',') === (attrInfo.granularities as any)?.join(',')
                         })}
                         onClick={() => handleSelect(item.value)}
                    >
                      <span>{item.label}</span>
                      <span>{item.eg}</span>
                    </div>
                  ))}
                </div>
              )}>
      <Button className={classNames('!hidden', {
        'group-hover:!inline-block': attrInfo.granularities?.length
      })}
              icon={<DownOutlined className='hover:!text-blue-500'/>}
              type='text'
              onClick={() => setOpen(true)}
      />
    </Popover>
  )
}