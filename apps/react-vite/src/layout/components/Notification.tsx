/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description:
 */
import Icon from '@/components/Icon'
import { TOOLBAR_ICON_SIZE } from '@/layout/constants'
import { Badge, Popover, Tabs, TabsProps } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import List from './List'

interface MessageImpl {
  data?: any
}

type MessageState = {
  todoList: any[]
  hasDoneList: any[]
}

const StyledContent = styled.div`
  width: 200px;
  height: 260px;
`

const Message: React.FC<MessageImpl> = () => {
  const [message, setMessage] = useState<MessageState>({
    todoList: [],
    hasDoneList: []
  })

  useEffect(() => {
    _init()
  }, [])

  const _init = () => {
    console.log('12333')
    setTimeout(() => {
      setMessage((prev) => ({
        ...prev,
        todoList: [
          {
            key: '1',
            type: '1',
            title: '谢谢关注',
            content: '小弟不胜感谢!!',
            time: '一分钟前'
          },
          {
            key: '2',
            type: '3',
            title: '这个是主题',
            content: '小弟不胜感谢!!',
            time: '一小时前'
          },
          {
            key: '3',
            type: '2',
            title: '谢谢关注',
            content: '小弟不胜感谢!!',
            time: '昨天'
          }
        ],
        hasDoneList: []
      }))
    }, 100)
  }

  const items: TabsProps['items'] = useMemo(() => {
    return [
      {
        key: 'pending',
        label: `待办（${message.todoList?.length || 0}）`,
        children: <List data={message.todoList} />
      },
      {
        key: 'hasDone',
        label: `已办（${message.hasDoneList?.length || 0}）`,
        children: <List data={message.hasDoneList} />
      }
    ]
  }, [message])

  const handleChange = () => {}

  return (
    <StyledContent>
      <Tabs defaultActiveKey="pending" items={items} onChange={handleChange} />
    </StyledContent>
  )
}

const Notification = () => {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <Popover
      content={<Message />}
      destroyTooltipOnHide={false}
      className="notification"
      placement="bottom"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {/* messageTotalCount */}
      <Badge count={5}>
        <Icon type="icon-notification" style={{ fontSize: `${TOOLBAR_ICON_SIZE}px`, color: 'var(--classic-head-color)' }} />
      </Badge>
    </Popover>
  )
}

export default Notification
