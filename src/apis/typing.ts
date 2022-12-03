import {ValueType} from "./metaInfo";
import type {Layout} from "react-grid-layout";

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
  "showAxisLabels": boolean,
  "autoAxisTitle": boolean,
  "axisTitle": string,
  "showHorizontalLines": boolean,
  "autoDataRange": boolean,
  "autoZoom": boolean,
  "showAbbreviateValues": boolean
}
type GranularitiesType = "SECONDS" | "MINUTES" | "HOUR_OF_DAY" | "DAY_OF_MONTH" | "MONTH_OF_YEAR" | "YEARS" | "WEEK_OF_YEAR" | "DAY_OF_WEEK" | "DAY_OF_YEAR"
export type Aggregation = "sum" | "avg" | "max" | "min" | "stddev" | "median" | "countDistinct" | "count" | "ratio" | "noAgg"
export type AttrConfig = {
  aggregation?: Aggregation
  alias: string
  id: string
  type: ValueType
  "granularities"?: GranularitiesType[] | 'noTransformation'
}
export type ComponentConfig<CT = `${ChartType}`> = {
  configType: `${ComponentType}`
  alias?: Record<string, string>
  requestState: {
    id: string
    dimensions?: AttrConfig[]
    includeNullValues: boolean
    measureConfigs?: AttrConfig[]
    measureConfig?: AttrConfig
    selections?: AttrConfig[]
    options?: {
      bucketInterval?: number
      timeUnit?: CT extends "dist" ? "years" | "months" | "weeks" | "seconds" | "minutes" | "hours" | "days" : "y" | "m" | "w" | "ms" | "s" | "min" | "h" | "d"
      bucketIntervalUnit?: | "BASE" | "K" | "M" | "B"
      type: number
      numberOfBuckets?: number
      otherBucketPercentage?: number
    }
  }
  type: CT
  viewState: {
    autoDimensionAxisTitle: boolean
    caption: string
    dimensions: {
      [key: string]: {
        useNameAsTitle: boolean
        id: string
        displayName: string
      }
    }
    measures: {
      [key: string]: {
        chartType?: "area" | "spline" | "areaspline" | "line" | "column"
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

export type Chart = {
  config: ComponentConfig,
  layout: Layout
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

export type FilterInfo = {
  isTemp?: boolean
  compId: string
  field: string
  fieldName?: string
  type: "ValueFilter"
  values: (string | null)[]
}
export type ComponentRequestInfo = {
  "selections": {
    "type": "Standard" | "Distribution" | "Agg" | "CountDistinctDate"
    "key": string
    "asColumn": string
    "config"?: {
      "type": "timeDistributionConfig" | "distributionConfig"
      "interval": 1
      "timeUnit"?: "months"
    },
    "parameters"?: any[]
    "aggregation"?: string
    "granularities"?: GranularitiesType[]
    numBuckets?: number
    otherBucketPercentage?: number
  }[]
  "filterList": {
    "type": "FilterList"
    "mode": "AND"
    "filters": FilterInfo[]
  }
  sortCriteria: any[]
  "includeNullValues": boolean
  "considerDistinct": boolean
  "size": number
}

export type ChartDataResponse = {
  headers: string[]
  rows: [string, string][] | [{from: string, to?: string}, string][]
  status: "Success"
}