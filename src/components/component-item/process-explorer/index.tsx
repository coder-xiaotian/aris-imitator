import {useEffect, useRef, useState} from "react";
import {
  EdgeInfo,
  GraphInfo,
  NodeInfo,
  NodeType,
  StartEndNodeName,
  useProcessData
} from "@/components/component-item/hooks";
import {ComponentConfig, FilterInfo} from "../../../apis/typing";
import Wrapper from "@/components/component-item/wrapper";
import SettingDrawser from "@/components/component-item/process-explorer/setting-drawser";
// @ts-ignore
import {Graphviz} from "@hpcc-js/wasm/graphviz";
import {DirGraph} from "@/components/component-item/process-explorer/components";

const DPI = 99
const PIXEL_PER_POINT = DPI / 72
type ProcessExplorerProps = {
  componentConfig: ComponentConfig,
  aliasMap: any,
  metaData: any,
  filterList: FilterInfo[]
  addingFilter: boolean
}
export default ({filterList, addingFilter, metaData, aliasMap, componentConfig}: ProcessExplorerProps) => {
  const {nodeStepList, loading} = useProcessData({filterList, addingFilter, metaData, aliasMap, componentConfig})

  const [graphInfo, setGraphInfo] = useState<GraphInfo>({
    viewBox: "",
    nodes: [],
    edges: []
  })
  useEffect(() => {
    if (!nodeStepList.length) return
    const gData = nodeStepList[0]
    Graphviz.load().then((graphviz: Graphviz) => {
      const dotStr = generateDotStr(gData.nodes, gData.edges)
      const res = graphviz.dot(dotStr, "json")
      const data = layoutDataParser(JSON.parse(res))
      setGraphInfo(data)
      // console.log(dotStr, gData, JSON.parse(res), data)
    })
  }, [nodeStepList])

  const [isVariety, setIsVariety] = useState(false)

  return (
    <Wrapper loading={loading}>
      <div className="flex h-full">
        <div className="grow flex justify-center">
          <DirGraph data={graphInfo}/>
        </div>
        <SettingDrawser isVariety={isVariety}/>
      </div>
    </Wrapper>
  )
}

const LeftBadgeWidth = 22
const RectHeight = 40

function generateDotStr(nodes: NodeInfo[], edges: EdgeInfo[]) {
  return `digraph G {
    ${nodes
    .map((n) => {
      if (n.name === StartEndNodeName.Start || n.name === StartEndNodeName.End) return `${n.name} [shape="rect",width="2",fixedSize="true",originName="${n.name}",type=${n.type},measure="${n.measure}"];`;

      const originName = n.name
      const name = originName.replaceAll(" ", "_")
      const width = measureText(n.name + n.percent) / PIXEL_PER_POINT
      const label = `<<TABLE><TR><TD fixedsize="true" height="${RectHeight}" width="${LeftBadgeWidth}" PORT="p"></TD><TD fixedsize="true" height="${RectHeight}" width="${width}"> </TD></TR></TABLE>>`
      return `${name} [label=${label},shape="plaintext",originName="${originName}",measure="${n.measure}",percent="${n.percent}",type=${n.type},isStart=${n.isStart},isEnd=${n.isEnd},rectWidth=${width + LeftBadgeWidth},rectHeight=${RectHeight},level=${n.level}];`;
    })
    .join("\n")}
    ${edges.map((e) => {
    let from = e.from.replaceAll(" ", "_")
    if (e.from !== StartEndNodeName.Start) {
      from += ":p:c"
    }
    let to = e.to.replaceAll(" ", "_")
    if (e.to !== StartEndNodeName.End) {
      to += ":p:c"
    }

    let weight = e.measure
    if (e.from === StartEndNodeName.Start || e.to === StartEndNodeName.End) {
      weight = 1
    }

    return `${from} -> ${to}[weight="${weight}",headclip="false",tailclip="false",label="${e.measure}",type=${e.type},from="${e.from}",to="${e.to}",level=${e.level}];`
  }).join("\n")}
  }`;
}

function layoutDataParser(layoutedJson: any) {
  const [xPt, yPt, widthPt, heightPt] = layoutedJson.bb.split(",")
  const width = widthPt * PIXEL_PER_POINT
  const height = heightPt * PIXEL_PER_POINT
  const nodeRightWidthMap: { [key: string]: number } = {}
  const retData = {
    viewBox: `${xPt * PIXEL_PER_POINT} ${yPt * PIXEL_PER_POINT} ${width} ${height}`,
    nodes: layoutedJson.objects
      .map((item: any) => {
        let [x, y] = item.pos.split(",");
        const rectWidth = Number(item.rectWidth)
        const rectHeight = Number(item.rectHeight)
        if (item.type === NodeType.StartEnd) {
          x = Number(x) * PIXEL_PER_POINT
          y = (Number(heightPt) - Number(y)) * PIXEL_PER_POINT
        } else {
          x = (Number(x) - rectWidth / 2) * PIXEL_PER_POINT
          y = (Number(heightPt) - Number(y) - rectHeight / 2) * PIXEL_PER_POINT
        }
        nodeRightWidthMap[item.originName] = item.rectWidth - LeftBadgeWidth

        return {
          type: item.type,
          name: item.originName,
          measure: item.measure,
          percent: item.percent,
          isStart: item.isStart === "true",
          isEnd: item.isEnd === "true",
          width: rectWidth * PIXEL_PER_POINT,
          height: rectHeight * item.rectHeight,
          x,
          y,
          level: item.level,
        };
      }),
    edges:
      layoutedJson.edges?.map((item: any) => {
        const points = item._draw_.filter((o: any) => o.op === "b")[0].points;
        const [lpX, lpY] = item.lp.split(",")

        return {
          type: item.type,
          from: item.from,
          to: item.to,
          measure: item.label,
          level: item.level,
          labelPos: [Number(lpX) * PIXEL_PER_POINT, (heightPt - Number(lpY)) * PIXEL_PER_POINT],
          ...handlePath(item.from, item.to, points, heightPt, nodeRightWidthMap),
        };
      }) ?? [],
  };
  return retData;
};

function handlePath(
  from: string,
  to: string,
  points: Array<number[]>,
  heightPt: number,
  nodeRightWidthMap: { [key: string]: number }
) {
  const firstPoint = points[0];
  const secondPoint = points[2]
  const penultimatePoint = points[points.length - 2]
  const lastPoint = points[points.length - 1]
  let d,
    selfLoop = from === to;
  if (selfLoop) { // todo 自循环应该是朝右的一个曲线
    d = `M ${firstPoint[0] * PIXEL_PER_POINT},${(heightPt - firstPoint[1]) * PIXEL_PER_POINT}A 2 1 0 1 1 ${
      firstPoint[0] * PIXEL_PER_POINT
    },${(heightPt - firstPoint[1]) * PIXEL_PER_POINT}`;
  } else {
    const [ax, ay] = firstPoint
    const [bx, by] = secondPoint
    let x = ax, y = ay
    const height = 10
    const rightWidth = nodeRightWidthMap[from] + 15
    const rectTan = Math.abs(height / ((bx - ax > 0 ? rightWidth : LeftBadgeWidth)))
    const tan = Math.abs((ay - by) / (bx - ax))
    if (!isNaN(tan)) {
      if (tan > rectTan) {
        if (ax < bx && ay > by) { // 第二个点在第一个点右下角
          y = ay - height
          x = ((ay - y) / tan) + ax
        } else if (ax < bx && ay < by) { // 第二个点在第一个点右上角
          y = ay + height
          x = (((y - ay) / tan) + ax) - 250
        } else if (ax > bx && ay < by) { // 第二个点在第一个点左上角
          y = ay + height
          x = ((ay - y) / tan) + ax
        } /* else if (ax > bx && ay > by) { // 第二个点在第一个点左下角
        y = ay - height
        x = ((y - ay) / tan) + ax
      }*/
      } else {
        if (ax < bx && ay > by) { // 第二个点在第一个点右下角
          y = ay - height
          x = ((ay - y) / tan) + ax
        } else if (ax < bx && ay < by) { // 第二个点在第一个点右上角
          x = ax + rightWidth
          y = tan * (x - ax) + ay
        } /*else if (ax > bx && ay < by) { // 第二个点在第一个点左上角
        y = ay + height
        x = ((ay - y) / tan) + ax
      } else if (ax > bx && ay > by) { // 第二个点在第一个点左下角
        y = ay - height
        x = ((y - ay) / tan) + ax
      }*/
      }
    } else {
      if (by - ay > 0) { // 第二个点在上面
        y += height
      } else {
        y -= height
      }
    }
    x = x * PIXEL_PER_POINT
    y = (heightPt - y) * PIXEL_PER_POINT
    d = "M"
      .concat(String(x), ",")
      .concat(String(y), "C", String(x) + ",", String(y) + " ")
      .concat(
        points.slice(2).map((p) => {
          return "".concat(String(p[0] * PIXEL_PER_POINT), ",").concat(`${(heightPt - p[1]) * PIXEL_PER_POINT}`);
        }).join(" ")
      );
  }

  return {
    d,
  };
}

let ctx: CanvasRenderingContext2D | null;

function measureText(text: string) {
  if (!ctx) {
    ctx = document.createElement('canvas').getContext("2d")
  }
  ctx!.font = '16px Arial';

  return ctx!.measureText(text).width + 40;
}