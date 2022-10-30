import {ValueType} from "./metaInfo";

export enum ComponentType {
  CHART = 0,
  SINGLE = 1,
  ACTION = 2 ,
  PROCESS = "processExplorer"
}
export enum ChartType {
  GRID = "grid",
  SINGLE_KPI = "singleKPI",
  BAR = "column",
  DIST = "dist",
  LINE = "line",
  AREA = "area",
  TIME = "time",
  PIE = "pie"
}

type AxisConfig = {
  "showAxisLabels": true,
  "autoAxisTitle": true,
  "axisTitle": "",
  "showHorizontalLines": true,
  "autoDataRange": true,
  "autoZoom": false,
  "showAbbreviateValues": true
}
type GranularitiesType = "SECONDS" | "MINUTES" | "HOUR_OF_DAY" | "DAY_OF_MONTH" | "MONTH_OF_YEAR" | "YEARS" | "WEEK_OF_YEAR" | "DAY_OF_WEEK" | "DAY_OF_YEAR"
type Aggregation = "countDistinct" | "count" | "noAgg"
export type AttrConfig = {
  aggregation?: Aggregation
  alias: string
  id: string
  type: ValueType
  "granularities"?: GranularitiesType[] | 'noTransformation'
}
export type ComponentConfig = {
  configType: `${ComponentType}`
  alias?: Record<string, string>
  requestState: {
    id: string
    dimensions?: AttrConfig[]
    includeNullValues: boolean
    measureConfigs?: AttrConfig[]
    measureConfig?: AttrConfig
    selections?: AttrConfig[]
  }
  type: `${ChartType}`
  viewState: {
    autoDimensionAxisTitle: boolean
    caption: string
    dimensions: {
      [key: string]: any
    }
    measures: {
      [key: string]: {
        chartType: `${ChartType}`
        displayName?: string
        colorHex: string
        formatting: number
        id: string
        useNameAsTitle: boolean
        yAxisNumberOfDecimals: number
      }
    }
    dimensionAxisTitle: string
    hasSubtitle: boolean
    isInverted: boolean
    isStacked: boolean
    legendPosition: number
    measureAxes: {
      "primary": AxisConfig,
      "secondary": AxisConfig
    }
    showAbbreviateValues: boolean
    showDataLabels: boolean
    showDimensionAxisLabels: boolean
    showLegend: "RESPONSIVELY"
    showVerticalLines: boolean
    subtitle: string
  }
}
export type ChartLayout = {
  x: number
  y: number
  w: number
  h: number
}

export type Chart = {
  config: ComponentConfig,
  layout: ChartLayout
}

export type DashBoardContent = {
  configurationState: {
    charts: Chart[]
  }
  configurationStateVersion: string
  type: keyof typeof TabType
  usedAliases: string[]
}

export enum TabType {
  APP_BUILDER = 'APP_BUILDER'
}

export type AnalysisTabInfo = {
  analysisKey: string
  name: string
  projectKey: string
  tabKey: string
  type: keyof typeof TabType
}
export type AliasMapping = {
  "special": {
    [key: string]: string
  },
  "normal": {[key: string]: string},
  "script": {[key: string]: string}
}
export type DashBoardInfo = {
  "projectKey": string
  "analysisKey": string
  "tabKey": string
  "name": string
  "type": keyof typeof TabType
  content: DashBoardContent
  "aliasMapping": AliasMapping,
  "version": {
    "primaryTerm": number,
    "sequenceNumber": number
  }
}

export type ComponentRequestInfo = {
  "selections": {
    "type": "Standard" | "Distribution" | "Agg" | "CountDistinctDate"
    "key": string
    "asColumn": string
    "config"?: {
      "type": "timeDistributionConfig" | "distributionConfig"
      "interval": 1
      "timeUnit": "months"
    },
    "parameters"?: any[]
    "aggregation"?: string
    "granularities"?: GranularitiesType[]
  }[]
  "filterList": {
    "type": "FilterList"
    "mode": "AND"
    "filters": any[]
  }
  sortCriteria: any[]
  "includeNullValues": boolean
  "considerDistinct": boolean
  "size": number
}

export type ChartDataResponse = {
  headers: string[]
  rows: string[][]
  status: "Success"
}