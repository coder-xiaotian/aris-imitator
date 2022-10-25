import Label from "@/components/label";
import {Button, Input, Select, Switch, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {useContext, useState} from "react";
import {AliasMapping, ChartType, ComponentConfig} from "../../../apis/typing";
import InlineLabel from "@/components/label/inline-label";
import {DashBoardContext} from "@/components/layouts/dashboard-layout";
import {getColData} from "@/components/component-config/utils";
import {ColumnType} from "../../../apis/metaInfo";
import AttributeDrawer from "@/components/component-config/data-config/attribute-drawer";
import classNames from "classnames";
import ButtonGroup from "antd/es/button/button-group";

type DataConfigProps = {
  configing: ComponentConfig | undefined
  aliasMap: AliasMapping
}
export default ({configing, aliasMap}: DataConfigProps) => {
  const {metaData} = useContext(DashBoardContext)
  const [subtitle, setSubtitle] = useState<string>()
  const dimensions = configing?.requestState.dimensions ?? []
  const measures = configing?.requestState.measureConfigs ?? []

  const [openAttrDrawer, setOpenAttrDrawer] = useState<'dimension' | 'measure'>()

  return (
    <>
      {
        configing?.type !== ChartType.DIST && configing?.type !== ChartType.TIME && (
          <Label title="图表类型">
            <Select className='w-full' value={configing?.type} options={[
              {label: '表', value: ChartType.GRID},
              {label: '饼图', value: ChartType.PIE},
              {label: '面积图', value: ChartType.AREA},
              {label: '条形图', value: ChartType.BAR},
              {label: '折线图', value: ChartType.LINE}
            ]} />
          </Label>
        )
      }
      <Label title='标题'>
        <Input value={configing?.viewState.caption}/>
        {
          subtitle === undefined && (
            <Button className='!text-blue-400 hover:!text-blue-500 !flex !justify-between !items-center'
                    icon={<PlusOutlined/>}
                    type='text'
                    onClick={() => setSubtitle('')}
            >添加副标题</Button>
          )
        }
      </Label>
      {
        subtitle !== undefined && (
          <Label title='副标题'>
            <div className='flex justify-center items-center'>
              <Input value={configing?.viewState.subtitle}/>
              <Button icon={<DeleteOutlined/>} type='text'
                      className='!text-gray-400 hover:!text-red-400'
                      onClick={() => setSubtitle(undefined)}
              />
            </div>
          </Label>
        )
      }
      <Label title='维度'>
        {
          dimensions.map(item => {
            const col = getColData(item.alias, aliasMap, metaData)
            return (
              <Tooltip key={item.id} color='white' overlayInnerStyle={{color: 'black'}} placement='left'
                // @ts-ignore
                       title={`${col?.description}(${ColumnType[col?.valueCalculationType]})`}
              >
                <div className='group flex justify-between items-center ml-2 my-1'>
                  <span>{col?.description}</span>
                  <ButtonGroup>
                    <Button className='!invisible'/>
                    <Button className='!hidden group-hover:!inline-block'
                            type='text' icon={<DeleteOutlined className='hover:!text-red-400'/>}
                            onClick={() => {}}
                    />
                  </ButtonGroup>
                </div>
              </Tooltip>
            )
          })
        }
        <Button disabled={openAttrDrawer === 'dimension'}
                className={classNames('!flex !justify-between !items-center',
                  [openAttrDrawer === 'dimension' ? '!text-slate-400' : '!text-blue-400 hover:!text-blue-500'])}
                icon={<PlusOutlined/>}
                type='text'
                onClick={() => setOpenAttrDrawer('dimension')}
        >添加维度</Button>
      </Label>
      <Label title='指标'>
        {
          measures.map(item => {
            const col = getColData(item.alias, aliasMap, metaData)
            return (
              <Tooltip key={item.id} color='white' overlayInnerStyle={{color: 'black'}} placement='left'
                // @ts-ignore
                       title={item.aggregation ? `${item.aggregation}(${col?.description})(${ColumnType[col?.valueCalculationType]})`
                         // @ts-ignore
                         : `${col?.description}(${ColumnType[col?.valueCalculationType]})`}
              >
                <div className='ml-2 my-1'>{col?.description}</div>
              </Tooltip>
            )
          })
        }
        <Button disabled={openAttrDrawer === 'measure'}
                className={classNames('!flex !justify-between !items-center',
                  [openAttrDrawer === 'measure' ? '!text-slate-400' : '!text-blue-400 hover:!text-blue-500'])}
                icon={<PlusOutlined/>}
                type='text'
                onClick={() => setOpenAttrDrawer('measure')}
        >添加指标</Button>
      </Label>
      <Label title='分区'>
        <Button disabled={true} className='!text-slate-400 !flex !justify-between !items-center'
                icon={<PlusOutlined/>}
                type='text'
                onClick={() => {}}
        >添加分区</Button>
      </Label>
      <Label title='正在排序'>
        <div>
          <span className="text-xs">默认排序</span>
        </div>
        <Button className='!text-blue-400 hover:!text-blue-500 !flex !justify-between !items-center'
                icon={<EditOutlined/>}
                type='text'
                onClick={() => {}}
        >配置排序</Button>
      </Label>
      <InlineLabel title='堆叠'>
        <Switch/>
      </InlineLabel>
      <InlineLabel title='反转轴'>
        <Switch/>
      </InlineLabel>
      <InlineLabel title='包括空值'>
        <Switch/>
      </InlineLabel>
      <AttributeDrawer category={openAttrDrawer} onClose={() => setOpenAttrDrawer(undefined)}/>
    </>
  )
}