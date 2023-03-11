import Label from "@/components/label";
import {InputNumber, Radio, Select, Switch} from "antd";
import {ComponentConfig} from "../../../apis/typing";
import {ConfigChangeHandler} from "@/pages/[projectName]/analyses/[aid]";
import {divide, multiply} from "@/utils/math";
import {ValueType} from "../../../apis/metaInfo";
import produce from "immer";

export function getType1Opt(dimensionType: ValueType | undefined) {
  if (dimensionType === 'TIMESPAN') {
    return {
      bucketInterval: 1,
      type: 1,
      timeUnit: 'h' as const
    }
  } else {
    return {
      bucketInterval: 1,
      type: 1,
      bucketIntervalUnit: 'BASE' as const
    }
  }
}
export function calcBucketIntervalVal(type: any, v: number, method: 'multiply' | 'divide' = 'multiply') {
  const fn = method === 'multiply' ? multiply : divide
  const map = {
    'BASE': () => v,
    'K': () => fn(v, 1000),
    'M': () => fn(v, 1000000),
    'B': () => fn(v, 1000000000),
    'ms': () => v,
    's': () => fn(v, 1000),
    'min': () => fn(v, 1000),
    'h': () => fn(v, 3600000),
    'd': () => fn(v, 86400000),
    'w': () => fn(v, 604800000),
    'm': () => fn(v, 2592000000),
    'y': () => fn(v, 31104000000),
    'default': () => 1
  }
  // @ts-ignore
  return map[type]()
}
type BucketProps = {
  configing: ComponentConfig
  onChange: ConfigChangeHandler
}
export default ({configing, onChange}: BucketProps) => {
  const dimensionType = configing.requestState.dimensions?.[0]?.type

  return (
    <Label title="存储桶" required>
      <Radio value={1} checked={configing?.requestState.options?.type === 1} className='!flex'
             onChange={() => onChange(produce(configing, draft => {draft.requestState.options = getType1Opt(dimensionType)}))}>时段间隔</Radio>
      {
        configing?.requestState.options?.type === 1 && (
          <InputNumber value={configing.requestState.options?.bucketInterval}
                       disabled={!configing.requestState.dimensions?.length} min={1}
                       className='w-full pl-6 my-2'
                       addonAfter={configing.requestState.dimensions?.length && (
                         <Select
                           value={configing.requestState.options.bucketIntervalUnit || configing.requestState.options.timeUnit}
                           options={dimensionType === 'TIMESPAN' ? [{
                             label: '毫秒',
                             value: 'ms'
                           }, {
                             label: '秒',
                             value: 's'
                           }, {
                             label: '分',
                             value: 'min'
                           }, {
                             label: '小时',
                             value: 'h'
                           }, {
                             label: '天',
                             value: 'd'
                           }, {
                             label: '周',
                             value: 'w'
                           }, {
                             label: '月',
                             value: 'm'
                           }, {
                             label: '年',
                             value: ''
                           }] : [{
                             label: '基础',
                             value: "BASE"
                           }, {
                             label: '千',
                             value: 'K'
                           }, {
                             label: '百万',
                             value: 'M'
                           }, {
                             label: '十亿',
                             value: 'B'
                           }]}
                           onChange={(v) => onChange(produce(configing, draft => {
                             if (dimensionType === "TIMESPAN") {
                               draft.requestState.options!.timeUnit = v as any
                             } else {
                               draft.requestState.options!.bucketIntervalUnit = v as any
                             }
                           }))}/>
                       )}
                       onChange={v => onChange(produce(configing, draft => {
                         draft.requestState.options!.bucketInterval = v!
                       }))}
          />
        )
      }
      <Radio value={2} checked={configing?.requestState.options?.type === 2}
             className='!mt-2'
             onChange={() => onChange(produce(configing, draft => {
               draft.requestState!.options = {
                 numberOfBuckets: 10,
                 type: 2
               }
             }))}
      >自动分布</Radio>
      {
        configing?.requestState.options?.type === 2 && (
          <>
            <Label title='存储桶数' className='pl-6'>
              <InputNumber className='!w-full' min={1}
                           value={configing.requestState.options.numberOfBuckets}
                           onChange={v => onChange(produce(configing, draft => {
                             draft.requestState.options!.numberOfBuckets = v!
                           }))}
              />
            </Label>
            <div className='flex justify-between mt-4 pl-6'>
              <span>为异常值添加存储桶（其他）</span>
              <Switch checked={Boolean(configing.requestState.options.otherBucketPercentage)} onChange={v => {
                onChange(produce(configing, draft => {
                  if (v) {
                    draft.requestState.options!.otherBucketPercentage = 10
                  } else {
                    draft.requestState.options!.otherBucketPercentage = 0
                  }
                }))
              }}/>
            </div>
            {Boolean(configing.requestState.options.otherBucketPercentage) && (
              <Label title='异常值存储桶中的数据百分比（其他）' className='pl-6'>
                <InputNumber value={configing.requestState.options.otherBucketPercentage} onChange={(v) => onChange(produce(configing, draft => {
                  draft.requestState.options!.otherBucketPercentage = v!
                }))} className='!block' min={1} addonAfter="%"/>
              </Label>
            )}
          </>
        )
      }
    </Label>
  )
}