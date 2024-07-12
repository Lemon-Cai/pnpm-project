/*
 * @Author: CP
 * @Date: 2024-06-18 09:50:15
 * @Description:
 */
// import { App, Layout } from 'antd'
import { createStyles } from 'antd-style'

import Page from '@/components/Page'
import { useUserStore } from '@/store'
import useMounted from '@/hooks/useMounted'

const useStyles = createStyles(({ token, css, prefixCls }) => ({
  default: css`
    .${prefixCls}-layout-header {
      background-color: ${token.colorPrimary};
    }
  `,
  moreWeight: css`
    // ↓
    &.override.${prefixCls}-layout-header {
      background-color: ${token.colorPrimary};
    }
  `
}))

const Home = () => {
  const { styles, cx } = useStyles()

  const userInfo = useUserStore(state => state.userInfo)

  useMounted(() => {
    console.log('useMounted , userInfo = ', userInfo)
  })

  return (
  //   <App>
  //   <Layout>
  //     <Layout.Header className={styles.default}>无法覆盖</Layout.Header>
  //     <Layout.Header className={styles.moreWeight}>可正常覆盖</Layout.Header>
  //   </Layout>
  // </App>
    <Page>
      <Page.Header className={styles.default}></Page.Header>
      <Page.Header className={cx('override', styles.moreWeight)}></Page.Header>
      <Page.Content>
        <div style={{ height: '1000px' }}></div>
      </Page.Content>
    </Page>
  )
}

export default Home
