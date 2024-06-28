/*
 * @Author: CP
 * @Date: 2024-01-08 20:35:06
 * @Description:
 */

import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'

import { ConfigProvider, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
// import { StyleProvider } from '@ant-design/cssinjs'
import styled from 'styled-components'

// import router from '@/router'
import useRouter from '@/router/hooks/useRouter'

const StyledAntdApp = styled(AntdApp)`
  width: 100%;
  height: 100%;
`

function App() {
  // const { primaryColor } = useGlobalStore()

  const router = useRouter()

  return (
    // <StyleProvider hashPriority="high" layer> // 不能加这个, 否则 使用 styled-component 无法覆盖样式
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          // colorPrimary: primaryColor
        }
      }}
    >
      <StyledAntdApp>
        {/* <AuthRouter>
          </AuthRouter> */}
        <Suspense>
          <RouterProvider router={router} />
        </Suspense>
      </StyledAntdApp>
    </ConfigProvider>
    // {/* </StyleProvider> */}
  )
}

export default App
