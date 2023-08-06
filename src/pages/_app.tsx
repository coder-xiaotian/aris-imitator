import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'moment/locale/zh-cn'
import {ReactElement, ReactNode} from "react";
import {NextPage} from "next";
import {StyleProvider} from "@ant-design/cssinjs"

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <StyleProvider hashPriority="high">
      <div className='overflow-hidden h-screen'>
        {getLayout(<Component {...pageProps} />)}
      </div>
    </StyleProvider>
  )
}

export default MyApp
