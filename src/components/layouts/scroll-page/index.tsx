import {PropsWithChildren, useEffect, useRef, useState} from 'react'
import {LeftOutlined, RightOutlined} from "@ant-design/icons";


export default ({children}: PropsWithChildren) => {
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const [moveX, setMoveX] = useState(0)
  const moveXRef = useRef(0)
  const maxMoveXRef = useRef(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listWrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!listWrapperRef.current) return

    const mutationOb = new MutationObserver(() => {
      maxMoveXRef.current = listWrapperRef.current!.scrollWidth - wrapperRef.current!.clientWidth
      if (listWrapperRef.current!.scrollWidth === wrapperRef.current!.clientWidth) {
        setShowRight(false)
        setShowLeft(false)
        setMoveX(0)
        moveXRef.current = 0
      } else if (moveXRef.current > 0 && moveXRef.current < maxMoveXRef.current) {
        setShowLeft(true)
        setShowRight(true)
      } else if (moveXRef.current === 0) {
        setShowLeft(false)
        setShowRight(true)
      } else if (moveXRef.current === maxMoveXRef.current) {
        setShowRight(false)
        setShowLeft(true)
      }
    })
    mutationOb.observe(listWrapperRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    })

    return () => mutationOb.disconnect()
  }, [listWrapperRef.current])
  function handlePrev() {
    if (moveX - 100 < 0) {
      moveXRef.current = 0
      setMoveX(0)
    } else {
      moveXRef.current = moveX - 100
      setMoveX(moveX - 100)
    }
  }
  function handleNext() {
    if (moveX + 100 > maxMoveXRef.current) {
      moveXRef.current = maxMoveXRef.current
      setMoveX(maxMoveXRef.current)
    } else {
      moveXRef.current = moveX + 100
      setMoveX(moveX + 100)
    }
  }

  return (
    <div className="relative max-w-[750px] overflow-hidden whitespace-nowrap"
         ref={wrapperRef}>
      {
        showLeft && (
          <div className="cursor-pointer flex items-center absolute left-0 top-0 z-10 w-4 h-full bg-gray-300 hover:bg-gray-100"
               onClick={handlePrev}
          >
            <LeftOutlined/>
          </div>
        )
      }
      <div ref={listWrapperRef} className="h-full" style={{transform: `translate(${-moveX}px, 0)`, transition: "all .3s ease-in-out"}}>
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