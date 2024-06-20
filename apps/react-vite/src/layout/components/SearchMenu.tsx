/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description:
 */
import { useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Modal } from 'antd'

import { TOOLBAR_ICON_SIZE } from '@/layout/constants'

const SearchMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="searchMenu" onClick={handleClick}>
        <SearchOutlined style={{ fontSize: `${TOOLBAR_ICON_SIZE}px` }} />
      </div>

      <Modal title="搜索" open={isModalOpen} footer={null} onCancel={handleCancel}>
        <Input.Search placeholder='菜单搜索' />
      </Modal>
    </>
  )
}

export default SearchMenu
