/*
 * @Author: CP
 * @Date: 2024-07-04 17:09:28
 * @Description: 
 */
import { Button, Space, Card } from 'antd'

import useMounted from '@/hooks/useMounted'
import { default as LoadingCmp } from '@/components/Loading'

const Loading = () => {
  useMounted(() => {
    console.log('组件 onMounted ')
  })

  const handleOpenLoading = () => {
    let loading = LoadingCmp.service({
      fullscreen: true
    })

    setTimeout(() => loading.hide(), 2000)
  }

  return (
    <div>
      <Space direction='vertical'>
        <Button onClick={handleOpenLoading}>函数式调用Loading</Button>
        <LoadingCmp>
          <Card title="Card title" bordered={false} style={{ width: 300 }}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </LoadingCmp>
        
        <LoadingCmp delay={300}>
          <Card title="Card title" bordered={false} style={{ width: 300 }}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </LoadingCmp>
      </Space>
    </div>
  )
}

export default Loading
