import Label from "@/components/label";
import {Input, Select, Switch} from "antd";
import {ComponentConfig} from "../../apis/typing";
import {ConfigChangeHandler} from "@/pages/analyses/[aid]";

type MeasureConfitProps = {
  name: string,
  id: string,
  configing: ComponentConfig
  onChange: ConfigChangeHandler
}
export default ({configing, id, onChange}: MeasureConfitProps) => {
  const measureConfig = configing.viewState.measures[id]

  return (
    <div>
      <Label title="备用系列类型">
        <Select className="!w-full" options={[{
          label: "面积",
          value: "area"
        }, {
          label: "曲线",
          value: "spline"
        }, {
          label: "曲线面积",
          value: "areaspline"
        }, {
          label: "行",
          value: "line"
        }, {
          label: "字段",
          value: "column"
        }]} />
      </Label>
      <Label title="显示名称">
        <div className="flex justify-between">
          <span>使用指标名称作为显示名称</span>
          <Switch checked={measureConfig.useNameAsTitle}/>
        </div>
        <Input/>
      </Label>
    </div>
  )
}