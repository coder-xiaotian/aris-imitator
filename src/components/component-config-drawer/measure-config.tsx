import Label from "@/components/label";
import {Input, Select, Switch} from "antd";
import {ChartType, ComponentConfig} from "../../apis/typing";
import {ConfigChangeHandler} from "@/pages/analyses/[aid]";
import produce from "immer";

type MeasureConfitProps = {
  name: string,
  id: string,
  configing: ComponentConfig
  onChange: ConfigChangeHandler
}
export default ({configing, id, name, onChange}: MeasureConfitProps) => {
  const measureConfig = configing.viewState.measures[id]
  const alternativeSeriesType = measureConfig.chartType ||
    ((configing.type === "column" || configing.type === "line" || configing.type === "area")
      ? configing.type as Exclude<ComponentConfig["type"], "grid"|"singleKPI"|"dist"|"time"|"pie"> : undefined)

  return (
    <div>
      {alternativeSeriesType && (
        <Label title="备用系列类型">
          <Select className="!w-full !mt-2"
                  value={alternativeSeriesType}
                  onChange={v => onChange(produce(configing, draft => {
                    draft.viewState.measures[id].chartType = v
                  }))}
                  options={[{
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
                  }]}
          />
        </Label>
      )}
      <Label title="显示名称">
        <div className="flex justify-between">
          <span>使用指标名称作为显示名称</span>
          <Switch checked={measureConfig.useNameAsTitle} onChange={v => onChange(produce(configing, draft => {
            draft.viewState.measures[id].useNameAsTitle = v
          }))}/>
        </div>
        <Input className="!mt-2"
               disabled={measureConfig.useNameAsTitle}
               value={measureConfig.displayName || name} onChange={e => onChange(produce(configing, draft => {
          draft.viewState.measures[id].displayName = e.target.value
        }))} />
      </Label>
    </div>
  )
}