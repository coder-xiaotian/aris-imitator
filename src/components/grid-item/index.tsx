import {forwardRef} from "react";
import classNames from "classnames";
import {CardGridProps} from "antd/es/card";
import {Popover} from "antd";
import {CopyOutlined, DeleteOutlined, SettingOutlined} from "@ant-design/icons";

type GridItemProps = {
  disabled: boolean
  onConfig: () => void
}
export default forwardRef<HTMLDivElement, CardGridProps & GridItemProps>((props, ref) => {
  const {className, children, disabled, onConfig, ...otherProps} = props

  return (
    <Popover overlayClassName='p-0' style={{padding: '0'}} className='p-0' content={!disabled && (
      <div>
        <div className="p-2 inline-flex justify-center items-center hover:bg-gray-100">
          <CopyOutlined className='!text-blue-400 text-base'/>
        </div>
        <div className="p-2 inline-flex justify-center items-center hover:bg-gray-100" onClick={onConfig}>
          <SettingOutlined className='!text-blue-400 text-base'/>
        </div>
        <div className="p-2 inline-flex justify-center items-center hover:bg-gray-100">
          <DeleteOutlined className='!text-red-400 text-base'/>
        </div>
      </div>
    )}>
      <div className={classNames([className, 'resize relative bg-white rounded shadow'])} ref={ref} {...otherProps}>
        {children}
      </div>
    </Popover>
  )
})