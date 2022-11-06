import {Button} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import classNames from "classnames";
import {AggMethodInfo} from "@/components/component-config-drawer/data-config/attr-item";
import {Aggregation} from "../../../apis/typing";

type EditAggProps = {
  onClose: () => void
  onSelect: (key: Aggregation) => void
  aggs: AggMethodInfo[]
  selectedAttr: string
  selectedAgg: AggMethodInfo | undefined
  open: boolean
}
export default ({open, aggs, onClose, onSelect, selectedAttr, selectedAgg}: EditAggProps) => {
  return (
    <div className={classNames('absolute top-0 left-0 z-0 -translate-x-full w-[340px] h-full bg-gray-100 shadow-md', {
      'hidden': !open
    })}>
      <div className="flex justify-between items-center px-3 py-2">
        <span className='text-base font-medium'>编辑聚集</span>
        <Button type='text' icon={<CloseOutlined/>} onClick={onClose}/>
      </div>
      <div className='overflow-auto flex-grow'>
        <div>
          <>
            <div className='flex justify-start items-center pl-8 py-2'>
              <span>{selectedAgg?.description}</span>
              (<span className='inline-block ml-2 font-medium'>{selectedAttr}</span>)
            </div>
            {aggs.map(agg => (
              <div className={classNames('cursor-pointer flex items-center pl-8 py-2 hover:bg-slate-200 transition-all border-t border-t-gray-200', {
                'bg-slate-300': selectedAgg?.key === agg.key
              })}
                   key={agg.key}
                   onClick={() => selectedAgg?.key !== agg.key && onSelect(agg.key)}
              >
                {agg.description}
              </div>
            ))}
          </>
        </div>
      </div>
      <div className='absolute bottom-0 w-full p-2 border-t border-t-slate-200'>
        <Button type='primary' block onClick={onClose}>完成</Button>
      </div>
    </div>
  )
}