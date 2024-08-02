/*
 * @Author: CP
 * @Date: 2024-07-29 15:33:20
 * @Description: 表头拖拽实现： react-beautiful-dnd 适用于复杂的拖拽场景， react-resizable 适用于大小调整的场景
 * @Description: 这里选 react-resizable
 */

import { Resizable } from 'react-resizable'
import type { ResizeCallbackData } from 'react-resizable'

type Props = React.HTMLAttributes<unknown> & {
  onResize: (e: React.SyntheticEvent<Element>, data: ResizeCallbackData) => void
  width: number
  // children: React.Element<any>,
  // width: number,
  // height: number,
  // // If you change this, be sure to update your css
  // handleSize: [number, number] = [10, 10],
  // lockAspectRatio: boolean = false,
  // axis: 'both' | 'x' | 'y' | 'none' = 'both',
  // minConstraints: [number, number] = [10, 10],
  // maxConstraints: [number, number] = [Infinity, Infinity],
  // onResizeStop?: ?(e: SyntheticEvent, data: ResizeCallbackData) => any,
  // onResizeStart?: ?(e: SyntheticEvent, data: ResizeCallbackData) => any,
  // onResize?: ?(e: SyntheticEvent, data: ResizeCallbackData) => any,
  // draggableOpts?: ?Object
} //  &  Pick<ResizableProps, 'onResize' | 'width'>

const ResizableTitle: React.FC<Props> = (props) => {
  const { onResize, width, ...restProps } = props

  return (
    <Resizable
      width={width}
      height={0} // 不需要调整高度，设为 0
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        />
      }
      // onResizeStart={() => {
      //   document.body.onselectstart = () => false
      // }}
      onResize={onResize}
      // onResize={(e, { size }) => {
        // 设置最小宽度，防止列被隐藏
        // const newWidth = size.width < 75 ? 75 : size.width
        // setOffset(newWidth - width)
      // }}
      // onResizeStop={(...arg) => {
      //   document.body.onselectstart = () => true
      //   setOffset(0)
      //   onResize(...arg)
      // }}
      draggableOpts={{
        enableUserSelectHack: false
      }}
    >
      <th
        {...restProps}
        style={{
          overflow: 'visible',
          ...restProps.style
        }}
      >
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}
        >
          {restProps.children}
        </div>
      </th>
    </Resizable>
  )
}

export default ResizableTitle
