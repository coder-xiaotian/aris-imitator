import {Button, Space, Tooltip} from "antd";
import {
  ApartmentOutlined,
  ControlOutlined,
  FieldBinaryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
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
            <SliderItem/>
            <Space direction="vertical">
              <Tooltip placement="left" title="显示流程面板">
                <Button type="text" className="!text-slate-500 hover:!text-sky-500" icon={<ControlOutlined />}/>
              </Tooltip>
              <Tooltip placement="left" title="显示变种面板">
                <Button type="text" className="!text-slate-500 hover:!text-sky-500" icon={<ApartmentOutlined />}/>
              </Tooltip>
              <Tooltip placement="left" title="切换到完整视图">
                <Button type="text" className="!text-slate-500 hover:!text-sky-500"
                        icon={<MenuFoldOutlined />}
                        onClick={toggleView}
                />
              </Tooltip>
            </Space>
          </div>
        ) : (
          <div className="flex flex-col justify-between w-80 h-full">
            <h2 className="px-2 text-xl">流程</h2>
            <div>middle</div>
            <div className="flex justify-between px-2">
              <Tooltip title="切换到紧凑视图">
                <Button type="text" className="!text-slate-500 hover:!text-sky-500"
                        icon={<MenuUnfoldOutlined />}
                        onClick={toggleView}
                />
              </Tooltip>
              <div>
                <Tooltip title="显示流程面板">
                  <Button type="text" className="!text-slate-500 hover:!text-sky-500" icon={<ControlOutlined />}/>
                </Tooltip>
                <Tooltip title="显示变种面板">
                  <Button type="text" className="!text-slate-500 hover:!text-sky-500" icon={<ApartmentOutlined />}/>
                </Tooltip>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

function SliderItem() {
  return <div>slider</div>
}