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
import {Node} from "@/components/component-item/process-explorer/components";
import AutoResizer from "@/components/auto-resizer";

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

  const processDataRef = useRef()
  const nodeStepDataRef = useRef<any>()
  const [graphInfo, setGraphInfo] = useState<GraphInfo>({
    width: 0,
    height: 0,
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
  const [scale, setScale] = useState(1)
  // let dividend = width, divisor = graphInfo.width ?? 0
  // if (graphInfo.width < graphInfo.height) {
  //   dividend = height
  //   divisor = graphInfo!.height
  // }
  // setScale(Number((dividend / (divisor + 750)).toFixed(2)))

  return (
    <Wrapper loading={loading}>
      <div className="flex h-full">
        <div className="grow flex justify-center">
          <svg viewBox={graphInfo.viewBox} style={{transform: `scale(${scale})`}} className="origin-top">
            <g>
              {graphInfo?.nodes.map(n => <Node key={n.name} info={n}/>)}
            </g>
          </svg>
        </div>
        <SettingDrawser isVariety={isVariety}/>
      </div>
    </Wrapper>
  )
}

type NodeProps = {
  data: { x: number, y: number, label: string }
}

function generateDotStr(nodes: NodeInfo[], edges: EdgeInfo[]) {
  return `digraph G {
    ${nodes
    .map((n) => {
      if (n.name === StartEndNodeName.Start || n.name === StartEndNodeName.End) return `${n.name} [shape="rect",width="1.9696969696969697",fixedSize="true",originName="${n.name}",type=${n.type}];`;
      
      const originName = n.name
      const name = originName.replaceAll(" ", "_")
      const width = measureText(n.name + n.percent) / PIXEL_PER_POINT
      const label = `<<TABLE><TR><TD fixedsize="true" height="40" width="22" PORT="p"></TD><TD fixedsize="true" height="40" width="${width}"> </TD></TR></TABLE>>`
      return `${name} [label=${label},shape="plaintext",originName="${originName}",measure="${n.measure}",percent="${n.percent}",type=${n.type},isStart=${n.isStart},isEnd=${n.isEnd},rectWidth=${width + 22},rectHeight=40];`;
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

      return `${from} -> ${to}[weight="${weight}",headclip="false",tailclip="false",label="${e.measure}",type=${e.type},from="${e.from}",to="${e.to}"];`
  }).join("\n")}
  }`;
}

function layoutDataParser(layoutedJson: any) {
  const [xPt, yPt, widthPt, heightPt] = layoutedJson.bb.split(",")
  const width = widthPt * PIXEL_PER_POINT
  const height = heightPt * PIXEL_PER_POINT
  const retData = {
    width,
    height,
    viewBox: `${xPt * PIXEL_PER_POINT} ${yPt * PIXEL_PER_POINT} ${width} ${height}`,
    nodes: layoutedJson.objects
      .map((item: any) => {
        let [x, y] = item.pos.split(",");
        let ret: any = {
          type: item.type,
          name: item.originName,
          measure: item.measure,
          percent: item.percent,
          isStart: item.isStart === "true",
          isEnd: item.isEnd === "true",
          width: item.rectWidth,
          height: item.rectHeight,
        };
        if (item.type === NodeType.StartEnd) {
          ret.x = Number(x) * PIXEL_PER_POINT;
          ret.y = (Number(heightPt) - Number(y)) * PIXEL_PER_POINT;
          ret.width = 54;
          ret.height = 54;
        } else {
          ret.x = Number(x) * PIXEL_PER_POINT;
          ret.y = (Number(heightPt) - Number(y)) * PIXEL_PER_POINT;
          ret.width = 288;
          ret.height = 72;
        }
        return ret;
      }),
    edges:
      layoutedJson.edges?.map((item: any) => {
        const points = item._draw_.filter((o: any) => o.op === "b")[0].points;

        return {
          type: item.type,
          from: item.from,
          to: item.to,
          measure: item.label,
          ...handlePath(item.from, item.to, points),
        };
      }) ?? [],
  };
  return retData;
};

function handlePath(from: string, to: string, points: Array<number[]>) {
  const firstPoint = points[0];
  let d,
    selfLoop = from === to;
  if (selfLoop) {
    d = `M ${firstPoint[0] * DPI},${-firstPoint[1] * DPI}A 2 1 0 1 1 ${
      firstPoint[0] * DPI
    },${-firstPoint[1] * DPI}`;
  } else {
    d = "M"
      .concat(String(firstPoint[0] * DPI), ",")
      .concat(String(-firstPoint[1] * DPI), "C")
      .concat(
        ...points.slice(1).map((p) => {
          return "".concat(String(p[0] * DPI), ",").concat(`${-p[1] * DPI}`);
        })
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