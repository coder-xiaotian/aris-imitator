import {PropsWithChildren} from "react";

type InlineLabelProps = {
  title: string
}
export default ({children, title}: PropsWithChildren<InlineLabelProps>) => {
  return (
    <div className='flex justify-between items-center mt-3'>
      <label className='inline-block mb-1 font-medium'>{title}</label>
      {children}
    </div>
  )
}