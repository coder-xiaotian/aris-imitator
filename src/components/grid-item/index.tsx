import {forwardRef, useState} from "react";
import classNames from "classnames";
import {CardGridProps} from "antd/es/card";
import {Button, Popover} from "antd";
import {CopyOutlined, DeleteOutlined, SettingOutlined} from "@ant-design/icons";

type GridItemProps = {
  disabled: boolean
  selected: boolean
  scrollIntoView: boolean
  title: string
  subTitle: string
  onConfig: () => void
  onDelete: () => void
}
export default forwardRef<HTMLDivElement, CardGridProps & GridItemProps>((props, ref) => {
  const {title, subTitle, className, children, disabled, selected, scrollIntoView, onConfig, onDelete, ...otherProps} = props
  const [openDel, setOpenDel] = useState(false)
  const [openToolBox, setOpenToolBox] = useState(false)
  function handleRef(dom: HTMLDivElement) {
    if (!dom) return

    if (typeof ref !== 'function') {
      ref!.current = dom
    }
    if(scrollIntoView) {
      dom.scrollIntoView({behavior: 'smooth'})
    }
  }

  return (
    <Popover open={!disabled && openToolBox}
             onOpenChange={setOpenToolBox}
             overlayClassName='p-0'
             trigger='click'
             style={{padding: '0'}}
             className='p-0'
             content={(
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
      <div className={classNames([className, 'relative flex flex-col bg-white rounded shadow'], {
        'outline outline-2 outline-blue-400': selected,
        'hover:outline hover:outline-1 hover:outline-gray-900': !disabled && !selected
      })} ref={handleRef} {...otherProps}>
        <div className="flex flex-col items-center">
          <div className="text-lg text-[#605e5c]">{title}</div>
          <div className="text-sm text-[#a19f9d]">{subTitle}</div>
        </div>
        <div className="flex-grow min-h-0">
          {children}
        </div>
      </div>
    </Popover>
  )
})