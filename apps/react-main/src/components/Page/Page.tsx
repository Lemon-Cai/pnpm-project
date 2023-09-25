import { forwardRef } from 'react'
import { Layout, LayoutProps } from 'antd'
import classnames from 'classnames'

export interface PageImpl extends LayoutProps {
  children?: React.ReactNode
  className?: string | undefined
}

const Page: React.ForwardRefRenderFunction<
  React.Ref<HTMLElement> | undefined,
  PageImpl
> = ({ children, className, ...restProps }, ref) => {
  return (
    <Layout
      ref={ref as React.Ref<HTMLElement>}
      className={classnames(className, 'c_layout_container')}
      {...restProps}
    >
      {children}
    </Layout>
  )
}

export default forwardRef(Page)
