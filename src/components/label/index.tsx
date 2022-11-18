import {PropsWithChildren} from "react";
import classNames from "classnames";

type LabelProps = {
  title: string
  required?: boolean
  className?: string
}
export default ({children, title, required, className = ''}: PropsWithChildren<LabelProps>) => {
  return (
    <div className={classNames('mt-3', className)}>
      <label className={classNames('relative inline-block mb-1 font-medium', {
        'before:content-["*"] before:absolute before:-right-3 before:text-red-500': required
      })}>{title}</label>
      {children}
    </div>
  )
}