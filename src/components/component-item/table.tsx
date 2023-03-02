import {ChartDataResponse} from "../../apis/typing";

type TableProps = {
  data: ChartDataResponse | undefined
  title: string,
  subTitle: string,
}
export default ({data, title, subTitle}: TableProps) => {
  console.log(data)
  return (
    <div>
    </div>
  )
}