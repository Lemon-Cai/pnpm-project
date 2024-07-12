/*
 * @Author: CP
 * @Date: 2024-06-17 15:29:05
 * @Description:
 */
import { forwardRef } from 'react'
import { Layout } from 'antd'
import classnames from 'classnames'
import { createStyles } from 'antd-style'

import { Header as AntHeader } from 'antd/lib/layout/layout'

const useStyles = createStyles(({ prefixCls, css }) => ({
  header: css`
    &.${prefixCls}-layout-header {
      background-color: #fff;
      padding: 0 12px;
      min-height: 54px;
      height: auto;
      line-height: 54px;
    }
  `
}))

type AntHeaderImpl = typeof AntHeader

export interface HeaderImpl extends AntHeaderImpl {
  children?: React.ReactNode
  className?: string | undefined
}

const Footer: React.ForwardRefRenderFunction<
  React.Ref<HTMLElement> | undefined,
  Partial<HeaderImpl>
> = ({ children, className, ...restProps }, ref) => {
  const { styles } = useStyles()

  return (
    <Layout.Header
      ref={ref as React.Ref<HTMLElement>}
      className={classnames('c_layout_header', styles.header, className)}
      {...restProps}
    >
      {children}
    </Layout.Header>
  )
}

export default forwardRef(Footer)
