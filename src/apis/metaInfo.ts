export enum ColumnType {
  PROCESS = "案例字段",
  ACTIVITY = "活动字段"
}
type Unit = {
  description: string
  isPreSelected: boolean
  key: string
  shortDescription: string
  multiplier: number
  suffix: string
}
export type ColumnInfo = {
  "usageCategory": 'dimension' | 'measure',
  "key": string,
  "technicalName": {
    "type": "SYSTEM" | "CUSTOM",
    "name": string
  },
  "aggregationConfig": {
    "aggregations": {
      "key": string,
      "description": string
    }[],
    "defaultAggregation": string,
    "hasAggregations": boolean
  },
  "type": "LONG" | "TEXT" | "TIMESPAN" | "TIME_RANGE" | "TIME" | "DOUBLE",
  "flags": string[],
  "usage": string,
  "executionMode": "NORMAL",
  "isCustomCalculation": boolean,
  "isInsightsHook": boolean,
  "isComplianceRule": boolean,
  "isStale": boolean,
  "isFutureStale": boolean,
  "valueCalculationType": keyof typeof ColumnType,
  "nestedPath": string,
  "format": {
    "key": "NUMBER",
    "baseUnitKey": "BASE"
  },
  "description": string,
  "isInternal": boolean,
  "isVisibleInAnalysis": boolean,
  "isIdentifier": boolean,
  "relationPath": string
}
export type TableData = {
  tableInfo: {
    "namespace": string,
    "name": string,
    "type": "CASE" | "ENHANCEMENT" | "ACTIVITY" | "CONNECTION",
    "isFactTable": boolean,
    "nestedPath": string
  }
  columns: ColumnInfo[]
  children: TableData[]
}
export type MetaData = {
  configuredSourceColumns: {
    ACTIVITY_ID: boolean
    ACTIVITY_NAME: boolean
    CASE_ID: boolean
    END_TIME: boolean
    LINK_ID: boolean
    SORTING: boolean
    START_TIME: boolean
  }
  formatDefinitions: {
    defaultDecimals: number
    description: string
    finestUnit: Omit<Unit, 'multiplier' | 'suffix'>
    key: string
    units: Unit[]
  }[]
  legacyMode: boolean
  rootTable: TableData
}