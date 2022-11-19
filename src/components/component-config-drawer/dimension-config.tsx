import Label from "@/components/label";
import {Input, Switch} from "antd";
import {ComponentConfig} from "../../apis/typing";
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

  return (
    <Label title='显示名称'>
      <div className='flex justify-between items-center'>
        <span>使用维度名称作为显示名称</span>
        <Switch checked={useNameAsTitle} onChange={(v) => onChange(produce(configing, draft => {
          draft.viewState.dimensions[id].useNameAsTitle = v
        }))} />
      </div>
      <Input className='!mt-2' disabled={useNameAsTitle} value={displayName}/>
    </Label>
  )
}