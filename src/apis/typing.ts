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
export type ValueType = "TEXT" | "LONG" | "TIME"


type valueOf<T> = T[keyof T]
type AxisConfig = {
  "showAxisLabels": true,
  "autoAxisTitle": true,
  "axisTitle": "",
  "showHorizontalLines": true,
  "autoDataRange": true,
  "autoZoom": false,
  "showAbbreviateValues": true
}
export type ComponentConfig = {
  configType: valueOf<ComponentType>
  requestState: {
    id: string
    dimensions: {
      alias: string
      id: string
      type: ValueType
    }[]
    includeNullValues: boolean
    measureConfigs: {
      aggregation: string
      alias: string
      id: string
      type: ValueType
    }[]
  }
  type: valueOf<ChartType>
  viewState: {
    autoDimensionAxisTitle: boolean
    caption: string
    dimensions: {
      [key: string]: any
    }
    measures: {
      [key: string]: {
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