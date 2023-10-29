import React from 'react'
import { useRouteError, Link } from 'react-router-dom'
import { Result, Button } from 'antd'

const ErrorPage = () => {
  const error = useRouteError()
  console.log(error)
  return (
    <Result
      status="404"
      title="404"
      subTitle="对不起，你访问的页面不存在。"
      extra={<Button type="primary">
        <Link to="/">首页</Link>
      </Button>}
    />
  )
}

export default ErrorPage