/*
 * @Author: CP
 * @Date: 2024-06-17 15:20:29
 * @Description:
 */
import { forwardRef } from 'react'
import { Layout, LayoutProps } from 'antd'
// import classnames from 'classnames'
// import styled from 'styled-components'
import { createStyles } from 'antd-style'

const useStyles = createStyles(({ token, css, prefixCls }) => ({
  // default: css`
  //   // ↓ 不生效,无法实现覆盖
  //   .${prefixCls}-layout {
  //     /* background-color: ${token.colorPrimary}; */
  //     background-color: #fff;
  //     width: 100%;
  //     height: 100%;
  //     position: relative;
  //     overflow: auto;
  //   }
  // `,
  // ↓ 不生效
  // layout: {
  //   width: '100%',
  //   height: '100%',
  //   position: 'relative',
  //   overflow: 'auto',
  // }
  layout: css`
    // ↓
    &.${prefixCls}-layout {
      /* background-color: ${token.colorPrimary}; */
      background-color: #fff;
      width: 100%;
      height: 100%;
      position: relative;
      overflow: auto;
    }
  `
}))

export interface PageImpl extends LayoutProps {
  children?: React.ReactNode
  className?: string | undefined
}

// const StyledLayout = styled(Layout)`
//   width: 100%;
//   height: 100%;
//   position: relative;
//   overflow: auto;
// `

const Page: React.ForwardRefRenderFunction<React.Ref<HTMLElement> | undefined, PageImpl> = (
  { children, className, ...restProps },
  ref
) => {
  const { styles, cx } = useStyles()

  // way: 1
  // return (
  //   <StyledLayout
  //     ref={ref as React.Ref<HTMLElement>}
  //     className={classnames(className, 'c_layout')}
  //     {...restProps}
  //   >
  //     {children}
  //   </StyledLayout>
  // )

  // way: 2
  return (
    <Layout
      ref={ref as React.Ref<HTMLElement>}
      className={cx('c_layout', styles.layout, className)}
      {...restProps}
    >
      {children}
    </Layout>
  )
}

export default forwardRef(Page)
