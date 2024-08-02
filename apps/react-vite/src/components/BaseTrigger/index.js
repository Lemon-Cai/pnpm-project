import React, { forwardRef, memo, useState, useImperativeHandle } from 'react'
import Trigger from 'rc-trigger'

const BaseTrigger = (
  { trigger = ['click'], children, content, onBeforePopupChange, ...others },
  ref
) => {
  let [visible, setVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    onClose: () => setVisible(false)
  }))

  const handleVisible = val => {
    setVisible(val)
  }

  const handlePopupVisibleChange = val => {
    if (onBeforePopupChange && !onBeforePopupChange()) {
      // 增加打开弹窗前校验, 校验返回 false ，不打开弹窗
      return
    }
    handleVisible(val)
  }

  return (
    <Trigger
      action={trigger}
      popup={
        visible &&
        (typeof content === 'function'
          ? content({ visible: visible, onVisible: handleVisible, onCancel: handleVisible })
          : React.cloneElement(content, {
              visible: visible,
              onVisible: handleVisible,
              onCancel: handleVisible
            }))
      }
      mask
      maskClosable={false}
      popupVisible={visible}
      onPopupVisibleChange={handlePopupVisibleChange}
      {...others}>
      {children}
    </Trigger>
  )
}
export default memo(forwardRef(BaseTrigger))
