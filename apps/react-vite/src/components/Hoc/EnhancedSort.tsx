import { ComponentType,  RefObject,  useRef } from 'react'

import { useDrag, useDrop, DropTargetMonitor} from 'react-dnd'

type SortProps = {
  id: string | symbol,
  canDrag: boolean
  dragType: string | symbol,
  index: number
  onSort: (dragIndex: number, hoverIndex: number) => void
  onEndSort: () => void
}

type DragItem = {
  id: string | symbol;
  index: number;
  type: string | symbol;
}

function enhance(OriginCpn: ComponentType<{ opacity: number; handlerId: any; ref?: RefObject<HTMLElement> }>) {
  function EnhancedSort(props: SortProps) {
    // 默认都可以拖拽，除非自定义
    const { canDrag = true } = props

    const cpnRef = useRef<HTMLElement>(null)

    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: any }>({
      accept: props.dragType,
      collect(monitor: DropTargetMonitor) {
        return {
          handlerId: monitor.getHandlerId()
        }
      },
      hover(item: DragItem, monitor: DropTargetMonitor) {
        if (!cpnRef.current) return
        const dragIndex = item.index
        const hoverIndex = props?.index
        if (dragIndex === hoverIndex) {
          // 相同不处理
          return
        }
        // Determine rectangle on screen
        const hoverBoundingRect = cpnRef.current?.getBoundingClientRect()

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        // Determine mouse position
        const clientOffset = monitor.getClientOffset()

        // Get pixels to the top
        const hoverClientY = (clientOffset?.y ?? 0) - hoverBoundingRect.top

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return
        }

        // Time to actually perform the action
        // TODO:
        props?.onSort?.(dragIndex, hoverIndex)

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex
      }
    })

    // eslint-disable-next-line
    // @ts-ignore
    const [{ isDragging }, drag] = useDrag({
      item: { id: props?.id, index: props?.index, type: props.dragType },
      canDrag: (/* monitor */) => {
        return canDrag
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      end: (/* item, monitor */) => {
        props?.onEndSort?.()
      }
    })

    const opacity = isDragging ? 0 : 1

    drag(drop(cpnRef))

    return <OriginCpn ref={cpnRef} opacity={opacity} handlerId={handlerId} {...props} />
  }
  return EnhancedSort
}

export default enhance
