import {Button, Drawer, Select} from "antd";
import {AliasMapping, ChartType, ComponentConfig} from "../../apis/typing";
import {useContext, useEffect, useState} from "react";
import {DashBoardContext} from "@/components/layouts/dashboard-layout";
import DataConfig from "@/components/component-config-drawer/data-config";
import ViewConfig from "@/components/component-config-drawer/view-config";
import DimensionConfig from "@/components/component-config-drawer/dimension-config";
import MeasureConfig from "@/components/component-config-drawer/measure-config";
import {getColData} from "@/components/component-config-drawer/utils";
import {CloseOutlined} from "@ant-design/icons";
import {ConfigChangeHandler} from "@/pages/analyses/[aid]";
import classNames from "classnames";

type ComponentConfigProps = {
  configing: ComponentConfig | undefined
  onClose: () => void
  aliasMap: AliasMapping
  onChangeConfig: ConfigChangeHandler
  usedAliases: string[]
  open: boolean
}
enum OptionType {
  DATA_CONFIG,
  VIEW_CONFIG,
  DIMENSION_CONFIG,
  QUOTA_CONFIG
}
export default ({open, configing, onClose, aliasMap, usedAliases, onChangeConfig}: ComponentConfigProps) => {
  const {metaData} = useContext(DashBoardContext)
  const options = [{
    label: "设置",
    value: `${OptionType.DATA_CONFIG.toString()}:${OptionType.DATA_CONFIG.toString()}:`,
  }, ...(configing?.type !== ChartType.GRID ? [{
    label: "自定义",
    value: `${OptionType.VIEW_CONFIG.toString()}:${OptionType.VIEW_CONFIG.toString()}:`,
  }] : []),
    ...configing?.requestState.dimensions?.map((item, i) => {
      const colInfo = getColData(item.alias, aliasMap, metaData)
      return {
        label: `维度：${colInfo?.description}`,
        value: `${OptionType.DIMENSION_CONFIG.toString()}:${item.id}:${colInfo?.description}`,
        className: classNames({'border-t border-t-slate-200': i === 0})
      }
    }) ?? [],
    ...configing?.requestState.measureConfigs?.map((item, i) => {
      const colInfo = getColData(item.alias, aliasMap, metaData)
      return {
        label: `指标：${colInfo?.description}`,
        value: `${OptionType.QUOTA_CONFIG.toString()}:${item.id}:${colInfo?.description}`,
        className: classNames({'border-t border-t-slate-200': i === 0})
      }
    }) ?? []
  ]

  const [settingWhat, setSettingWhat] = useState({
    type: OptionType.DATA_CONFIG.toString(),
    id: OptionType.DATA_CONFIG.toString(),
    name: '',
  })
  useEffect(() => {
    setSettingWhat({
      type: OptionType.DATA_CONFIG.toString(),
      id: OptionType.DATA_CONFIG.toString(),
      name: '',
    })
  }, [configing?.requestState.id])
  function handleChangeSettingWhat(v: string) {
    const [type, id, name] = v.split(':')
    setSettingWhat({
      type,
      id,
      name
    })
  }

  const configMap = {
    [OptionType.DATA_CONFIG.toString()]: <DataConfig configing={configing}
                                                     aliasMap={aliasMap}
                                                     usedAliases={usedAliases}
                                                     onChange={onChangeConfig}/>,
    [OptionType.VIEW_CONFIG.toString()]: <ViewConfig/>,
    [OptionType.DIMENSION_CONFIG.toString()]: (
      settingWhat.id in (configing?.viewState.dimensions ?? {}) && <DimensionConfig configing={configing!}
                                                                            onChange={onChangeConfig}
                                                                            id={settingWhat.id}
                                                                            name={settingWhat.name}
      />
    ),
    [OptionType.QUOTA_CONFIG.toString()]: (
      settingWhat.id in (configing?.viewState.measures ?? {}) && <MeasureConfig id={settingWhat.id}
                                                                        configing={configing!}
                                                                        name={settingWhat.name}
                                                                        onChange={onChangeConfig}
      />
    )
  }
  return (
    <Drawer open={open}
            title="配置"
            mask={false}
            width={340}
            bodyStyle={{padding: 0}}
            closable={false}
            headerStyle={{padding: '8px 12px'}}
            extra={<Button onClick={onClose} type='text' icon={<CloseOutlined/>}/>}
    >
      <div className='sticky top-0 z-10 px-3 py-2 bg-slate-100'>
        <Select value={`${settingWhat.type}:${settingWhat.id}:${settingWhat.name}`} options={options} className='w-full' onChange={handleChangeSettingWhat} />
      </div>
      <div className='px-3'>
        {configMap[settingWhat.type]}
      </div>
    </Drawer>
  )
}