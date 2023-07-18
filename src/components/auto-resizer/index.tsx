import {ReactNode, useEffect, useRef, useState} from "react";

type AutoResizerProps = {
  className?: string
  style?: object
  onResize?: <T extends Element>(el: T, clientWidth: number, clientHeight: number) => void
  children:  (args: {width: number, height: number}) => ReactNode
}
export default ({ className, style, onResize = () => {}, children }: AutoResizerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [sizeObj, setSizeObj] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const el = entries[0].target;
      setSizeObj({
        width: el.clientWidth,
        height: el.clientHeight,
      });
      onResize(el, el.clientWidth, el.clientHeight);
    });
    resizeObserver.observe(ref.current!);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={ref} style={style} className={className}>
      {children(sizeObj)}
    </div>
  );
};
