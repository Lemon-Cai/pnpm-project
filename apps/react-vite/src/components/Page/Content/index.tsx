import { forwardRef } from 'react'
import { Layout } from 'antd'
import classnames from 'classnames'

import { BasicProps } from 'antd/lib/layout/layout'

// type AntContentImpl = typeof AntContent & React.HTMLAttributes<HTMLDivElement>

export interface ContentImpl extends BasicProps {
  children?: React.ReactNode
  className?: string | undefined
}

const Content: React.ForwardRefRenderFunction<
  React.Ref<HTMLElement> | undefined,
  Partial<ContentImpl>
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
