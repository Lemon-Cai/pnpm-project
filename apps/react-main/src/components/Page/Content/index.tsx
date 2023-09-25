import { forwardRef } from 'react'
import { Layout } from 'antd'
import classnames from 'classnames'

import { Content as AntContent } from 'antd/lib/layout/layout'

type AntContentImpl = typeof AntContent

export interface ContentImpl extends AntContentImpl {
  children?: React.ReactNode
  className?: string | undefined
}

const Content: React.ForwardRefRenderFunction<
  React.Ref<HTMLElement> | undefined,
  ContentImpl
> = ({ children, className, ...restProps }, ref) => {
  return (
    <Layout.Content
      ref={ref as React.Ref<HTMLElement>}
      className={classnames(className, 'c_layout_content')}
      {...restProps}
    >
      {children}
    </Layout.Content>
  )
}

export default forwardRef(Content)
