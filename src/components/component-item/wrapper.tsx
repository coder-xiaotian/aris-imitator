import {PropsWithChildren} from "react";
import {Spin} from "antd";

export default ({loading, error, children}: PropsWithChildren<{loading: boolean, error?: any}>) => {
  return (
    <Spin spinning={loading} wrapperClassName='w-full h-full'>
      {error ? (
        // @ts-ignore
        <div>{error.messageChain}</div>
      ) : children}
    </Spin>
  )
}