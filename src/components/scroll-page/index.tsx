import {PropsWithChildren, useRef, useState} from 'react'
import {LeftOutlined, RightOutlined} from "@ant-design/icons";

export default ({children}: PropsWithChildren) => {
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const [scrollLeft, setScrollLeft] = useState(0)
  const maxScrollLeftRef = useRef(0)
  function handleRef(dom: HTMLDivElement) {
    if (!dom) return

    maxScrollLeftRef.current = dom.scrollWidth - dom.clientWidth
    if (dom.scrollWidth === dom.clientWidth) {
      setShowRight(false)
      setShowLeft(false)
      setScrollLeft(0)
    } if (scrollLeft === 0) {
      setShowLeft(false)
      setShowRight(true)
    } else if (scrollLeft === maxScrollLeftRef.current) {
      setShowRight(false)
      setShowLeft(true)
    }
  }
  function handlePrev() {
    if (scrollLeft - 100 < 0) {
      setScrollLeft(0)
    } else {
      setScrollLeft(scrollLeft - 100)
    }
  }
  function handleNext() {
    if (scrollLeft + 100 > maxScrollLeftRef.current) {
      setScrollLeft(maxScrollLeftRef.current)
    } else {
      setScrollLeft(scrollLeft + 100)
    }
  }
  console.log(scrollLeft, maxScrollLeftRef)

  return (
    <div className="relative max-w-[750px] overflow-hidden whitespace-nowrap"
         ref={handleRef}>
      {
        showLeft && (
          <div className="cursor-pointer flex items-center absolute left-0 top-0 z-10 w-4 h-full bg-gray-300 hover:bg-gray-100"
               onClick={handlePrev}
          >
            <LeftOutlined/>
          </div>
        )
      }
      <div className="h-full" style={{transition: "all .3s ease-in-out", transform: `translate(${-scrollLeft}px, 0)`}}>
        {children}
      </div>
      {
        showRight && (
          <div className="cursor-pointer flex items-center absolute right-0 top-0 z-10 w-4 h-full bg-gray-300 hover:bg-gray-100"
               onClick={handleNext}
          >
            <RightOutlined/>
          </div>
        )
      }
    </div>
  )
}