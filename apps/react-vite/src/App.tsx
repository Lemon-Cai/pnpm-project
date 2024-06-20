/*
 * @Author: CP
 * @Date: 2024-01-08 20:35:06
 * @Description:
 */

import { RouterProvider } from 'react-router-dom'

import { ConfigProvider, App as AntdApp} from 'antd'
// import { StyleProvider } from '@ant-design/cssinjs'
import zhCN from 'antd/locale/zh_CN'

import router from '@/router'

function App() {
  // const [count, setCount] = useState(0)

  // const { primaryColor } = useGlobalStore()

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
      <AntdApp>

      <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
    // {/* </StyleProvider> */}
  )
}

export default App
