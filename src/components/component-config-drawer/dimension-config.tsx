import Label from "@/components/label";
import {Input, InputNumber, Switch} from "antd";
import {ChartType, ComponentConfig} from "../../apis/typing";
import {ConfigChangeHandler} from "@/pages/analyses/[aid]";
import produce from "immer";

type DimensionConfigProps = {
  id: string
  configing: ComponentConfig
  onChange: ConfigChangeHandler
  name: string
}
export default ({configing, id, onChange, name}: DimensionConfigProps) => {
  const useNameAsTitle = configing.viewState.dimensions[id].useNameAsTitle
  const displayName = configing.viewState.dimensions[id].displayName || name
  const cellSpan = configing.viewState.dimensions[id].cellSpan || 1

  return (
    <div>
      <Label title='显示名称'>
        <div className='flex justify-between items-center'>
          <span>使用维度名称作为显示名称</span>
          <Switch checked={useNameAsTitle} onChange={(v) => onChange(produce(configing, draft => {
            draft.viewState.dimensions[id].useNameAsTitle = v
          }))} />
        </div>
        <Input className='!mt-2' disabled={useNameAsTitle} value={displayName}/>
      </Label>
      {
        configing.type === ChartType.GRID && (
          <Label title='单元格大小'>
            <InputNumber className='!w-full !mt-2' min={1} value={cellSpan} onChange={(value: number | null) => {
              onChange(produce(configing, draft => {
                draft.viewState.dimensions[id].cellSpan = value!
              }))
            }}/>
          </Label>
        )
      }
    </div>
  )
}
