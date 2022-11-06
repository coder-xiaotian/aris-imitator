import {forwardRef, useEffect, useState} from "react";
import classNames from "classnames";
import {CardGridProps} from "antd/es/card";
import {Button, Popover} from "antd";
import {CopyOutlined, DeleteOutlined, SettingOutlined} from "@ant-design/icons";

type GridItemProps = {
  disabled: boolean
  selected: boolean
  onConfig: () => void
  onDelete: () => void
}
export default forwardRef<HTMLDivElement, CardGridProps & GridItemProps>((props, ref) => {
  const {className, children, disabled, selected, onConfig, onDelete, ...otherProps} = props
  const [openDel, setOpenDel] = useState(false)
  function handleRef(dom: HTMLDivElement) {
    if (!dom) return

    if (typeof ref !== 'function') {
      ref!.current = dom
    }
    if(selected) {
      dom.scrollIntoView({behavior: 'smooth'})
    }
  }

  return (
    <Popover overlayClassName='p-0'
             trigger='click'
             style={{padding: '0'}}
             className='p-0'
             content={!disabled && (
              <div>
                <div className="cursor-pointer p-2 inline-flex justify-center items-center hover:bg-gray-100">
                  <CopyOutlined className='!text-blue-400 text-base'/>
                </div>
                <div className="cursor-pointer p-2 inline-flex justify-center items-center hover:bg-gray-100" onClick={onConfig}>
                  <SettingOutlined className='!text-blue-400 text-base'/>
                </div>
                <Popover open={openDel}
                         onOpenChange={v => !v && setOpenDel(v)}
                         placement='right'
                         trigger='click'
                         content={(
                            <Button.Group>
                              <Button type='text' className='!text-red-500 hover:!bg-red-50' onClick={onDelete}>确定</Button>
                              <Button type='text' className='!text-gray-800' onClick={() => setOpenDel(false)}>取消</Button>
                            </Button.Group>
                          )}>
                  <div className="cursor-pointer p-2 inline-flex justify-center items-center hover:bg-gray-100"
                       onClick={() => setOpenDel(true)}>
                    <DeleteOutlined className='!text-red-400 text-base'/>
                  </div>
                </Popover>
              </div>
            )}
    >
      <div className={classNames([className, 'overflow-hidden relative bg-white rounded shadow '], {
        'outline outline-2 outline-blue-400': selected,
        'hover:outline hover:outline-1 hover:outline-gray-900': !disabled && !selected
      })} ref={handleRef} {...otherProps}>
        {children}
      </div>
    </Popover>
  )
})