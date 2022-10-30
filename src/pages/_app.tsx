import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'moment/locale/zh-cn'
import 'antd/dist/antd.css'
import {ReactElement, ReactNode} from "react";
import {NextPage} from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <div className='overflow-hidden h-screen'>
      {getLayout(<Component {...pageProps} />)}
    </div>
  )
}

export default MyApp
