import {PropsWithChildren} from "react";

type LabelProps = {
  title: string
}
export default ({children, title}: PropsWithChildren<LabelProps>) => {
  return (
    <div className='mt-3'>
      <label className='inline-block mb-1 font-medium'>{title}</label>
      {children}
    </div>
  )
}