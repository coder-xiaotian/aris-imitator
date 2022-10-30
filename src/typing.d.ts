declare module "echarts-stat" {
  import {ExternalDataTransform} from "echarts/types/src/data/helper/transform";
  const transform: {
    regression: ExternalDataTransform;
    histogram: ExternalDataTransform;
    clustering: ExternalDataTransform;
  };
}

type ValueOf<O, K extends keyof O> = O[K]

type FunComponentProps<Com> = Parameters<Com>[0]