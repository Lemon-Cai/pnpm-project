import { forwardRef } from "react";
import { Layout } from "antd";
import classnames from 'classnames'

import { Footer as AntFooter } from 'antd/lib/layout/layout'

type AntFooterImpl = typeof AntFooter

export interface FooterImpl extends AntFooterImpl {
  children?: React.ReactNode
  className?: string | undefined
}

const Footer: React.ForwardRefRenderFunction<
React.Ref<HTMLElement> | undefined,
FooterImpl
> = ({
  children,
  className,
  ...restProps
}) => {
  return (
    <Layout.Footer className={classnames(className, 'c_layout_footer')} {...restProps}>
      {children}
    </Layout.Footer>
  )
}

export default forwardRef(Footer)