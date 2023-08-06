import {Button, Space, Tooltip, Slider, Segmented, Switch, Select} from "antd";
import {
  ApartmentOutlined, ArrowDownOutlined,
  ControlOutlined,
  FieldBinaryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined, MinusOutlined, PlusOutlined,
  FieldTimeOutlined,
  InsertRowAboveOutlined, EditOutlined, FunctionOutlined
} from "@ant-design/icons";
import {useState} from "react";
import classNames from "classnames";
import AttributeDrawer from "@/components/component-config-drawer/data-config/attribute-drawer";
import {createPortal} from "react-dom";
import {Aggregation} from "../../../apis/typing";
import {ColumnInfo} from "../../../apis/metaInfo";

type SettingDrawserProps = {
  nodeMarks: number[]
  config: ProcessExplorerConfig
  onChange: (config: ProcessExplorerConfig) => void
}
export type ProcessExplorerConfig = {
  isVariety: boolean
  quota: {
    type: "频率" | "吞吐量时间" | "指标",
    numberConfig: "case" | "activity",
    agg: Omit<Aggregation, "countDistinct" | "count" | "ratio" | "noAgg">,
    quotaKey?: string
    quotaAgg?: Aggregation
    columnInfo: Partial<ColumnInfo>
    abbrNum: boolean
  }
}
export default ({config, nodeMarks, onChange}: SettingDrawserProps) => {
  const [isCompact, setIsCompact] = useState(true)
  const [openQuotaConfig, setOpenQuotaConfig] = useState<"measure" | undefined>()

  function toggleView() {
    setIsCompact(!isCompact)
  }

  return (
    <div className="overflow-hidden h-full py-2 rounded-t bg-gray-100">
      {
        isCompact ? (
          <div className="flex flex-col justify-between items-center w-16 h-full">
            <Tooltip title="配置显示的指标" placement="left">
              <Button type="text" className="!text-slate-500 !border !border-slate-400"
                      icon={<FieldBinaryOutlined className="text-sky-500"/>}/>
            </Tooltip>
            <SliderItem className="mt-2" marks={nodeMarks}/>
            <SliderItem className="mt-2" type="connect" marks={[]}/>
            <Space direction="vertical">
              <TooltipButton placement="left" title="显示流程面板"
                             icon={<ControlOutlined/>}
              />
              <TooltipButton placement="left" title="显示变种面板"
                             icon={<ApartmentOutlined/>}
              />
              <TooltipButton placement="left" title="切换到完整视图"
                             icon={<MenuFoldOutlined/>}
                             onClick={toggleView}
              />
            </Space>
          </div>
        ) : (
          <div className="flex flex-col justify-between w-80 h-full px-4 py-2">
            <h2 className="text-xl">流程</h2>
            <div className="grow">
              <QuotaConfig config={config.quota} onChange={(quota) => onChange({...config, quota})}/>
            </div>
            <div className="flex justify-between px-2">
              <TooltipButton title="切换到紧凑视图" icon={<MenuUnfoldOutlined/>} onClick={toggleView}/>
              <div>
                <TooltipButton title="显示流程面板" icon={<ControlOutlined/>}/>
                <TooltipButton title="显示变种面板" icon={<ApartmentOutlined/>}/>
              </div>
            </div>
          </div>
        )
      }
      {createPortal(<AttributeDrawer category={openQuotaConfig} className="z-10 right-0" exclusionNoAgg exclusionRatio />, document.body)}
    </div>
  )
}

type QuotaConfig = {
  className?: string
  config: ProcessExplorerConfig["quota"]
  onChange: (config: ProcessExplorerConfig["quota"]) => void
}

function QuotaConfig({className, config, onChange}: QuotaConfig) {
  function handleChange(key: string, value: any) {
    onChange({
      ...config,
      [key]: value
    })
  }
  const aggInfo = config.columnInfo?.aggregationConfig?.aggregations?.find(agg => agg.key === config.columnInfo?.aggregationConfig?.defaultAggregation)
  const map = {
    "频率": (
      <div className="mt-2">
        <span>数字</span>
        <Select value={config.numberConfig} onChange={(value) => handleChange("numberConfig", value)} className="!mt-2 w-full" options={[
          {value: "case", label: "案例频率"},
          {value: "activity", label: "活动频率"}
        ]}/>
      </div>
    ),
    "吞吐量时间": (
      <div className="mt-2">
        <span>聚集</span>
        <Select className="!mt-2 w-full" value={config.agg} onChange={(value) => handleChange("agg", value)} options={[
          {value: "stddev", label: "标准差"},
          {value: "avg", label: "平均值"},
          {value: "median", label: "中位数"},
          {value: "sum", label: "总和"},
          {value: "max", label: "最大值"},
          {value: "min", label: "最小值"},
        ]}/>
      </div>
    ),
    "指标": (
      <div className="mt-2">
        <div>
          <span>指标</span> - <span>配置</span>
        </div>
        <div className="inline-flex justify-between items-center w-full">
          <span>{aggInfo?.description}（{config.columnInfo.description}）</span>
          <div>
            <Button type="text" icon={<EditOutlined />}/>
            <Button type="text" icon={<FunctionOutlined />}/>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <h3>指标</h3>
      <div className="pt-1">
        <span>显示</span> - <span>频率</span>
      </div>
      <Segmented className="!mt-2 border border-gray-500" block value={config.type} onChange={(value: any) => handleChange("type", value)}
                 options={[{value: "频率", icon: <FieldBinaryOutlined/>}, {
                   value: "吞吐量时间",
                   icon: <FieldTimeOutlined/>
                 }, {
                   value: "指标",
                   icon: <InsertRowAboveOutlined/>
                 }]}/>
      {map[config.type]}
      <div className="flex justify-between items-center mt-2">
        <span>缩写数字</span>
        <Switch checked={config.abbrNum} onChange={(checked) => handleChange("abbrNum", checked)}/>
      </div>
    </div>
  )
}

function TooltipButton({
                         placement, title, icon, onClick = () => {
  }
                       }: any) {
  return (
    <Tooltip placement={placement} title={title}>
      <Button type="text" className="!text-slate-500 hover:!text-sky-500" icon={icon} onClick={onClick}/>
    </Tooltip>
  )
}

type SliderItemProps = {
  className: string
  type?: "activity" | "connect"
  marks: number[]
}

function SliderItem({className, type = "activity", marks}: SliderItemProps) {
  return (
    <div className={classNames(["grow flex flex-col items-center justify-between", className])}>
      {type === "activity" ? <span className="shrink-0 inline-block w-4 h-4 rounded-full border border-sky-500"/> :
        <ArrowDownOutlined className="!text-sky-500 text-lg"/>}
      <Slider vertical className="[&_.ant-slider-rail]:bg-gray-300 [&_.ant-slider-dot]:hidden" step={null}
              marks={marks.reduce((res, n) => {
                res[n] = {style: {display: "none"}, label: n}
                return res
              }, {} as any)}/>
      <Button.Group className="mt-2" size="small">
        <Button icon={<MinusOutlined/>}/>
        <Button icon={<PlusOutlined/>}/>
      </Button.Group>
    </div>
  )
}