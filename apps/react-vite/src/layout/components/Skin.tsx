/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description:
 */
import { useState } from 'react'
import { Drawer } from 'antd'

import Icon from '@/components/Icon'
import { TOOLBAR_ICON_SIZE } from '@/layout/constants'
import GlobalSetting from './GlobalSetting'

const Skin = () => {

  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <div className="skin" onClick={handleClick}>
        <Icon type="icon-skin" style={{ fontSize: `${TOOLBAR_ICON_SIZE}px` }} />
      </div>
      <Drawer
        title="全局设置"
        placement="right"
        closable={false}
        onClose={handleClick}
        open={open}
      >
        <GlobalSetting />
      </Drawer>
    </>
  )
}

export default Skin
