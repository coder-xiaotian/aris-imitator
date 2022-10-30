import {MetaData, TableData} from "../../apis/metaInfo";
import {AliasMapping} from "../../apis/typing";

export function getColData(alias: string, aliasMap: AliasMapping, metaData: MetaData | undefined): TableData['columns'][number] | undefined {
  const key = Object.assign({} as Record<string, string>, ...Object.values(aliasMap))[alias]
  function getColumn(table: TableData | undefined):  TableData['columns'][number] | undefined {
    const columns = table?.columns ?? []
    for(let i = 0; i < columns.length; i++) {
      if (key === columns[i].usage) {
        return columns[i]
      }
      if (key === columns[i].key) {
        return columns[i]
      }
    }

    let col
    for(let i = 0; i < (table?.children?.length ?? 0); i++) {
      col = getColumn(table?.children[i])
      if (col) return col
    }
  }
  return getColumn(metaData?.rootTable)
}