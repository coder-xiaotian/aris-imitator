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
      console.log(dotStr, gData, JSON.parse(res), data)
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

function generateDotStr(nodes: NodeInfo[], edges: EdgeInfo[]) {
  return `digraph G {
    ${nodes
    .map((n) => {
      if (n.name === StartEndNodeName.Start || n.name === StartEndNodeName.End) return `${n.name} [shape="rect",width="1.9696969696969697",fixedSize="true",originName="${n.name}",type=${n.type},measure="${n.measure}"];`;

      const originName = n.name
      const name = originName.replaceAll(" ", "_")
      const width = measureText(n.name + n.percent) / PIXEL_PER_POINT
      const label = `<<TABLE><TR><TD fixedsize="true" height="40" width="22" PORT="p"></TD><TD fixedsize="true" height="40" width="${width}"> </TD></TR></TABLE>>`
      return `${name} [label=${label},shape="plaintext",originName="${originName}",measure="${n.measure}",percent="${n.percent}",type=${n.type},isStart=${n.isStart},isEnd=${n.isEnd},rectWidth=${width + 22},rectHeight=40,level=${n.level}];`;
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
  const retData = {
    viewBox: `${xPt * PIXEL_PER_POINT} ${yPt * PIXEL_PER_POINT} ${width} ${height}`,
    nodes: layoutedJson.objects
      .map((item: any) => {
        let [x, y] = item.pos.split(",");
        const rectWidth = Number(item.rectWidth)
        const rectHeight = Number(item.rectHeight)
        x = item.type === NodeType.StartEnd ? Number(x) * PIXEL_PER_POINT : (Number(x) - rectWidth / 2) * PIXEL_PER_POINT
        y = item.type === NodeType.StartEnd ? (Number(heightPt) - Number(y)) * PIXEL_PER_POINT : (Number(heightPt) - Number(y) - rectHeight / 2) * PIXEL_PER_POINT

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
          ...handlePath(item.from, item.to, points, heightPt),
        };
      }) ?? [],
  };
  return retData;
};

function handlePath(
  from: string,
  to: string,
  points: Array<number[]>,
  heightPt: number
) {
  const firstPoint = points[0];
  let d,
    selfLoop = from === to;
  if (selfLoop) {
    d = `M ${firstPoint[0] * PIXEL_PER_POINT},${(heightPt - firstPoint[1]) * PIXEL_PER_POINT}A 2 1 0 1 1 ${
      firstPoint[0] * PIXEL_PER_POINT
    },${(heightPt - firstPoint[1]) * PIXEL_PER_POINT}`;
  } else {
    d = "M"
      .concat(String(firstPoint[0] * PIXEL_PER_POINT), ",")
      .concat(String((heightPt - firstPoint[1]) * PIXEL_PER_POINT), "C")
      .concat(
        points.slice(1).map((p) => {
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