import Label from "@/components/label";
import {Button, Input, InputNumber, Radio, Select, Switch} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {useContext, useEffect, useState} from "react";
import {Aggregation, AliasMapping, ChartType, ComponentConfig} from "../../../apis/typing";
import InlineLabel from "@/components/label/inline-label";
import {DashBoardContext} from "@/components/layouts/dashboard-layout";
import {ColumnInfo, TableData, ValueType} from "../../../apis/metaInfo";
import AttributeDrawer from "@/components/component-config-drawer/data-config/attribute-drawer";
import classNames from "classnames";
import {v4 as uuid} from 'uuid'
import {ConfigChangeHandler} from "@/pages/analyses/[aid]";
import AttrItem, {AggMethodInfo} from "@/components/component-config-drawer/data-config/attr-item";
import EditAggDrawer from "@/components/component-config-drawer/data-config/edit-agg-drawer";
import Bucket, {getType1Opt} from "@/components/component-config-drawer/data-config/bucket";

type DataConfigProps = {
  configing: ComponentConfig | undefined
  aliasMap: AliasMapping
  onChange: ConfigChangeHandler
  usedAliases: string[]
}
export default ({configing, aliasMap, usedAliases, onChange}: DataConfigProps) => {
  const {metaData} = useContext(DashBoardContext)
  const dimensions = configing?.requestState.dimensions ?? []
  const measures = configing?.requestState.measureConfigs ?? []
  const viewState = configing?.viewState

  const [openAttrDrawer, setOpenAttrDrawer] = useState<'dimension' | 'measure'>()
  const [attrMenus, setAttrMenus] = useState<FunComponentProps<typeof AttributeDrawer>['attrMenus']>([])
  useEffect(() => {
    if (!metaData && !openAttrDrawer) return

    function getExcludeKeys() {
      if (openAttrDrawer === 'dimension') { // 把已选的维度排除掉
        const map = Object.assign({} as Record<string, string>, ...Object.values(aliasMap))
        return dimensions.map(item => {
          return map[item.alias]
        })
      } else {
        return []
      }
    }
    const excludeKeys = getExcludeKeys()
    const excludeTypes: ValueType[] = []
    if (configing?.type === ChartType.TIME) {  // 时间系列图只保留字段类型为time的字段
      excludeTypes.push('TIMESPAN', 'TIME_RANGE', 'TEXT', 'DOUBLE', 'LONG')
    }
    function getMenus(tableData: TableData, prevTitles: string[] = [], menuList: any[] = []) {
      const isDist = configing?.type === 'dist' // 直方图将distributable过滤处理

      menuList.push({
        type: tableData.tableInfo.type,
        title: tableData.tableInfo.name,
        subTitle: prevTitles.join('/'),
        children: tableData.columns.filter(col => {
          return !col.isInternal && !excludeTypes.includes(col.type) &&
            (isDist && col.flags.includes('distributable')) && (
            col.usage !== 'NONE' ? !excludeKeys.includes(col.usage) : !excludeKeys.includes(col.key)
          )
        })
      })
      for(let item of tableData.children) {
        getMenus(item, [...prevTitles, tableData.tableInfo.name], menuList)
      }

      return menuList
    }
    setAttrMenus(getMenus(metaData!.rootTable))
  }, [metaData, openAttrDrawer])
  function handleSelectAttr(col: ColumnInfo) {
    let alias = ''
    // 处理别名映射
    if (col.technicalName.type === 'SYSTEM') {
      if (!Object.values(aliasMap.special).includes(col.usage)) { // 别名没在map中
        alias = uuid()
        aliasMap = {
          ...aliasMap,
          special: {
            ...aliasMap.special,
            [alias]: col.usage
          }
        }
      } else { // 别名已在map中
        alias = Object.keys(aliasMap.special).find(key => aliasMap.special[key] === col.usage)!
      }
    } else if (col.technicalName.type === 'CUSTOM') {
      if (!Object.values(aliasMap.normal).includes(col.key)) {
        alias = uuid()
        aliasMap = {
          ...aliasMap,
          normal: {
            ...aliasMap.normal,
            [alias]: col.key
          }
        }
      } else {
        alias = Object.keys(aliasMap.normal).find(key => aliasMap.normal[key] === col.key)!
      }
    }

    // todo 添加维度指标时把viewState中的配置加上
    if (openAttrDrawer === 'dimension') { // 添加维度
      if (configing?.type === ChartType.DIST) {
        onChange({
          ...configing!,
          requestState: {
            ...configing!.requestState,
            dimensions: [...configing?.requestState?.dimensions ?? [], {
              id: uuid(),
              alias,
              type: col.type
            }],
            options: getType1Opt(col.type)
          }
        }, aliasMap)
      } else {
        onChange({
          ...configing!,
          requestState: {
            ...configing!.requestState,
            dimensions: [...configing?.requestState?.dimensions ?? [], {
              id: uuid(),
              alias,
              type: col.type
            }]
          }
        }, aliasMap)
      }
    } else if (openAttrDrawer === 'measure') { // 添加指标
      onChange({
        ...configing!,
        requestState: {
          ...configing!.requestState,
          measureConfigs: [...configing!.requestState?.measureConfigs ?? [], {
            id: uuid(),
            alias,
            type: col.type,
            aggregation: col.aggregationConfig.defaultAggregation
          }]
        }
      }, aliasMap)
    }
  }
  function judgeDelAlias(alias: string) {
    const delUsedAliasIndex = usedAliases.findIndex(id => id === alias)
    usedAliases.splice(delUsedAliasIndex, 1)
    if (usedAliases.findIndex(id => id === alias) === -1) {
      delete aliasMap.special[alias]
      delete aliasMap.normal[alias]
      delete aliasMap.script[alias]
      aliasMap = {...aliasMap}
    }
    return aliasMap
  }
  function handleDeleteDimension(i: number) {
    const [delItem] = dimensions.splice(i, 1)
    delete viewState!.dimensions[delItem.id]
    // 判断是否需要删掉aliasMap中的别名
    judgeDelAlias(delItem.alias)

    onChange({
      ...configing!,
      requestState: {
        ...configing!.requestState,
        dimensions
      }
    }, aliasMap)
  }
  function handleDeleteMeasure(i: number) {
    const [delItem] = measures.splice(i, 1)
    delete viewState!.measures[delItem.id]
    // 判断是否需要删掉aliasMap中的别名
    judgeDelAlias(delItem.alias)

    onChange({
      ...configing!,
      requestState: {
        ...configing!.requestState,
        measureConfigs: measures
      }
    })
  }
  function handleSelectDimensionGranularity(i: number, value: any) {
    dimensions.splice(i, 1, {
      ...dimensions[i],
      granularities: value
    })
    onChange({
      ...configing!,
      requestState: {
        ...configing!.requestState,
        dimensions
      }
    })
  }
  function handleSelectMeasureGranularity(i: number, value: any) {
    measures.splice(i, 1, {
      ...measures[i],
      granularities: value
    })
    onChange({
      ...configing!,
      requestState: {
        ...configing!.requestState,
        measureConfigs: measures
      }
    })
  }

  const [editAggInfo, setEditAggInfo] = useState<{curAgg: AggMethodInfo, colInfo: ColumnInfo, index: number}>()
  function handleChangeAgg(agg: Aggregation) {
    measures[editAggInfo!.index].aggregation = agg
    onChange({
      ...configing!,
      requestState: {
        ...configing!.requestState,
        measureConfigs: [...measures]
      }
    })
    setEditAggInfo(undefined)
  }

  // 正在添加维度 || (时间系列图 && 已经配置了一个维度) || (直方图 && 已经配置了一个维度)
  const isAddDimensionDisable = openAttrDrawer === 'dimension'
    || (configing?.type === ChartType.TIME && configing.requestState.dimensions?.length === 1)
    || (configing?.type === ChartType.DIST && configing.requestState.dimensions?.length === 1)
  // 正在添加指标 || (时间系列图 && 已经配置了一个指标) || (饼图 && 已经配置了一个指标) || (直方图 && 已经配置了一个指标)
  const isAddMeasureDisable = openAttrDrawer === 'measure' ||
    (configing?.type === ChartType.TIME && configing.requestState.measureConfigs?.length === 1) ||
    (configing?.type === ChartType.PIE && configing.requestState.measureConfigs?.length === 1) ||
    (configing?.type === ChartType.DIST && configing.requestState.measureConfigs?.length === 1)
  // 显示分区
  const isPartitionVisible = configing?.type !== ChartType.TIME && configing?.type !== ChartType.PIE && configing?.type !== ChartType.DIST
  // 显示排序
  const isSortVisible = configing?.type !== ChartType.TIME && configing?.type !== ChartType.DIST

  return (
    <>
      {
        configing?.type !== ChartType.DIST && configing?.type !== ChartType.TIME && (
          <Label title="图表类型">
            <Select className='w-full'
                    value={configing?.type}
                    onChange={v => onChange({
                      ...configing!,
                      type: v
                    })}
                    options={[
                      {label: '表', value: ChartType.GRID},
                      {label: '饼图', value: ChartType.PIE},
                      {label: '面积图', value: ChartType.AREA},
                      {label: '条形图', value: ChartType.BAR},
                      {label: '折线图', value: ChartType.LINE}
                    ]}
            />
          </Label>
        )
      }
      <Label title='标题'>
        <Input value={viewState?.caption} onChange={e => onChange({
          ...configing!,
          viewState: {
            ...viewState!,
            caption: e.target.value
          }
        })}/>
        {
          !viewState?.hasSubtitle && (
            <Button className='!text-blue-400 hover:!text-blue-500 !flex !justify-between !items-center'
                    icon={<PlusOutlined/>}
                    type='text'
                    onClick={() => onChange({
                      ...configing!,
                      viewState: {
                        ...viewState!,
                        hasSubtitle: true
                      }
                    })}
            >添加副标题</Button>
          )
        }
      </Label>
      {
        viewState?.hasSubtitle && (
          <Label title='副标题'>
            <div className='flex justify-center items-center'>
              <Input value={viewState!.subtitle} onChange={e => onChange({
                ...configing!,
                viewState: {
                  ...viewState!,
                  subtitle: e.target.value
                }
              })}/>
              <Button icon={<DeleteOutlined/>} type='text'
                      className='!text-gray-400 hover:!text-red-400'
                      onClick={() => onChange({
                        ...configing!,
                        viewState: {
                          ...viewState!,
                          hasSubtitle: false,
                          subtitle: ''
                        }
                      })}
              />
            </div>
          </Label>
        )
      }
      <Label title='维度'>
        {
          dimensions.map((item, i) => <AttrItem key={item.id}
                                                isDimension={true}
                                                aliasMap={aliasMap}
                                                metaData={metaData}
                                                attrInfo={item}
                                                onDelete={() => handleDeleteDimension(i)}
                                                onSelectGranularity={(value) => handleSelectDimensionGranularity(i, value)}
          />)
        }
        <Button disabled={isAddDimensionDisable}
                className={classNames('!flex !justify-between !items-center',
                  [isAddDimensionDisable ? '!text-slate-400' : '!text-blue-400 hover:!text-blue-500'])}
                icon={<PlusOutlined/>}
                type='text'
                onClick={() => setOpenAttrDrawer('dimension')}
        >添加维度</Button>
      </Label>
      <Label title='指标'>
        {
          measures.map((item, i) => <AttrItem key={item.id}
                                              attrInfo={item}
                                              aliasMap={aliasMap}
                                              metaData={metaData}
                                              isDimension={false}
                                              onDelete={() => handleDeleteMeasure(i)}
                                              onSelectGranularity={value => handleSelectMeasureGranularity(i, value)}
                                              onSelectAgg={(curAgg, colInfo) => setEditAggInfo({curAgg, colInfo, index: i})}
          />)
        }
        <Button disabled={isAddMeasureDisable}
                className={classNames('!flex !justify-between !items-center',
                  [isAddMeasureDisable ? '!text-slate-400' : '!text-blue-400 hover:!text-blue-500'])}
                icon={<PlusOutlined/>}
                type='text'
                onClick={() => setOpenAttrDrawer('measure')}
        >添加指标</Button>
      </Label>
      {isPartitionVisible && (
        <Label title='分区'>
          <Button disabled={true} className='!text-slate-400 !flex !justify-between !items-center'
                  icon={<PlusOutlined/>}
                  type='text'
                  onClick={() => {}}
          >添加分区</Button>
        </Label>
      )}
      {
        isSortVisible && (
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
        )
      }
      {
        configing?.type === ChartType.TIME && (
          <Label title='粒度'>
            <Select className='w-full' options={[{value: 'seconds', label: '秒'}, {value: 'minutes', label: '分钟'},
              {value: 'hours', label: '小时'}, {value: 'days', label: '天'}, {value: 'weeks', label: '周'},
              {value: 'months', label: '月'}, {value: 'years', label: '年'}]}
                    value={configing.requestState.options?.timeUnit}
                    onChange={v => onChange({
                      ...configing,
                      requestState: {
                        ...configing.requestState,
                        options: {...configing.requestState.options!, timeUnit: v}
                      }
                    })}
            />
          </Label>
        )
      }
      {
        configing?.type === ChartType.DIST && (
          <Bucket configing={configing} onChange={onChange}/>
        )
      }
      {configing?.type !== ChartType.TIME && configing?.type !== ChartType.PIE && configing?.type !== ChartType.DIST && (
        <InlineLabel title='堆叠'>
          <Switch checked={configing?.viewState.isStacked} onChange={v => onChange({
            ...configing!,
            viewState: {...configing!.viewState, isStacked: v}
          })}/>
        </InlineLabel>
      )}
      {configing?.type !== ChartType.TIME && configing?.type !== ChartType.PIE && configing?.type !== ChartType.DIST && (
        <InlineLabel title='反转轴'>
          <Switch checked={configing?.viewState.isInverted} onChange={v => onChange({
            ...configing!,
            viewState: {...configing!.viewState, isInverted: v}
          })}/>
        </InlineLabel>
      )}
      <InlineLabel title='包括空值'>
        <Switch checked={configing?.requestState.includeNullValues} onChange={v => onChange({
          ...configing!,
          requestState: {...configing!.requestState, includeNullValues: v}
        })}/>
      </InlineLabel>
      <AttributeDrawer category={openAttrDrawer}
                       onClose={() => setOpenAttrDrawer(undefined)}
                       attrMenus={attrMenus}
                       onSelect={handleSelectAttr}
      />
      <EditAggDrawer open={!!editAggInfo}
                     aggs={editAggInfo?.colInfo.aggregationConfig.aggregations ?? []}
                     selectedAttr={editAggInfo?.colInfo.description ?? ''}
                     selectedAgg={editAggInfo?.curAgg}
                     onClose={() => setEditAggInfo(undefined)}
                     onSelect={handleChangeAgg}
      />
    </>
  )
}
