import Label from "@/components/label";
import {Input, Switch} from "antd";
import {AliasMapping, ComponentConfig} from "../../apis/typing";
import {ConfigChangeHandler} from "@/pages/analyses/[aid]";
import {getColData} from "@/components/component-config-drawer/utils";
import {useContext} from "react";
import {DashBoardContext} from "@/components/layouts/dashboard-layout";

type DimensionConfigProps = {
  id: string
  configing: ComponentConfig | undefined
  onChange: ConfigChangeHandler
  name: string
}
export default ({configing, id, onChange, name}: DimensionConfigProps) => {
  const useNameAsTitle = configing?.viewState.dimensions[id].useNameAsTitle
  const displayName = configing?.viewState.dimensions[id].displayName || name

  return (
    <Label title='显示名称'>
      <div className='flex justify-between items-center'>
        <span>使用维度名称作为显示名称</span>
        <Switch checked={useNameAsTitle} onChange={(v) => onChange({
          ...configing!,
          viewState: {
            ...configing!.viewState,
            dimensions: {
              ...configing!.viewState.dimensions,
              [id]: {
                ...configing!.viewState.dimensions[id],
                useNameAsTitle: v
              }
            }
          }
        })} />
      </div>
      <Input className='!mt-2' disabled={useNameAsTitle} value={displayName}/>
    </Label>
  )
}