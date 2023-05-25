import {Button, Space, Tooltip} from "antd";
import {
  ApartmentOutlined, ArrowDownOutlined,
  ControlOutlined,
  FieldBinaryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined, MinusOutlined, PlusOutlined
} from "@ant-design/icons";
import {useState} from "react";

type SettingDrawserProps = {
  isVariety: boolean
}
export default ({isVariety}: SettingDrawserProps) => {
  const [isCompact, setIsCompact] = useState(true)
  function toggleView() {
    setIsCompact(!isCompact)
  }

  return (
    <div className="overflow-hidden absolute right-0 h-full py-2 rounded-t bg-gray-100">
      {
        isCompact ? (
          <div className="flex flex-col justify-between items-center w-16 h-full">
            <Tooltip title="配置显示的指标" placement="left">
              <Button type="text" className="!text-slate-500 !border !border-slate-400" icon={<FieldBinaryOutlined className="text-sky-500" />}/>
            </Tooltip>
            <SliderItem/>
            <SliderItem type="connect"/>
            <Space direction="vertical">
              <TooltipButton placement="left" title="显示流程面板"
                             icon={<ControlOutlined />}
              />
              <TooltipButton placement="left" title="显示变种面板"
                             icon={<ApartmentOutlined />}
              />
              <TooltipButton placement="left" title="切换到完整视图"
                             icon={<MenuFoldOutlined />}
                             onClick={toggleView}
              />
            </Space>
          </div>
        ) : (
          <div className="flex flex-col justify-between w-80 h-full">
            <h2 className="px-2 text-xl">流程</h2>
            <div>middle</div>
            <div className="flex justify-between px-2">
              <TooltipButton title="切换到紧凑视图" icon={<MenuUnfoldOutlined />} onClick={toggleView}/>
              <div>
                <TooltipButton title="显示流程面板" icon={<ControlOutlined />}/>
                <TooltipButton title="显示变种面板" icon={<ApartmentOutlined />}/>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

function TooltipButton({placement, title, icon, onClick = () => {}}: any) {
  return (
    <Tooltip placement={placement} title={title}>
      <Button type="text" className="!text-slate-500 hover:!text-sky-500" icon={icon} onClick={onClick}/>
    </Tooltip>
  )
}

function SliderItem({type="activity"}) {
  return (
    <div className="flex flex-col items-center justify-between">
      {type === "activity" ? <span className="inline-block w-4 h-4 rounded-full border border-sky-500" /> : <ArrowDownOutlined className="!text-sky-500 text-lg" />}
      <div>bar</div>
      <Button.Group className="mt-2" size="small">
        <Button icon={<MinusOutlined />}/>
        <Button icon={<PlusOutlined />}/>
      </Button.Group>
    </div>
  )
}