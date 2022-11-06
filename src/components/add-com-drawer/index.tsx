import {Button, Drawer} from "antd";
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";
import {ChartType} from "../../apis/typing";

type AddComDrawerProps = {
  open: boolean
  onClose: () => void
  onAddCom: (type: `${ChartType}`) => void
}
export default ({open, onClose, onAddCom}: AddComDrawerProps) => {
  const items = [{
    key: ChartType.LINE,
    label: '折线图'
  }, {
    key: ChartType.AREA,
    label: '面积图'
  }, {
    key: ChartType.TIME,
    label: '时间系列图'
  }, {
    key: ChartType.BAR,
    label: '条形图'
  }, {
    key: ChartType.DIST,
    label: '分配图'
  }, {
    key: ChartType.PIE,
    label: '饼图'
  }, {
    key: ChartType.GRID,
    label: '表'
  }]
  return (
    <Drawer title='添加新组件'
            open={open}
            mask={false}
            width={340}
            bodyStyle={{padding: 0}}
            closable={false}
            headerStyle={{padding: '8px 12px'}}
            extra={<Button onClick={onClose} type='text' icon={<CloseOutlined/>}/>}
    >
      <h2 className='ml-3 text-lg'>图表与表</h2>
      <ul>
        {
          items.map(item => (
            <li key={item.key}
                className='group cursor-pointer flex justify-between items-center h-12 pl-3 pr-2 hover:bg-slate-100'
                onClick={() => onAddCom(item.key)}
            >
              <span className='inline-flex justify-start items-center w-full h-full border-b border-b-slate-200'>{item.label}</span>
              <Button className='!hidden group-hover:!inline-block' type='text' icon={<PlusOutlined className='!text-gray-500'/>}/>
            </li>
          ))
        }
      </ul>
    </Drawer>
  )
}