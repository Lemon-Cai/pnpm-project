/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description: 
 */

import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { HOME_URL } from '@/config/constants'
import { useUserStore } from '@/store'

const StyledRoot = styled.section`
  width: 100%;
  height: 100%;
  > main {
    width: 100%;
    height: 100%;
  }

  .form-container {
    width: 500px;
    height: 50%;
    margin: auto;
    transform: translateY(50%);
  }
`
const Login = () => {

  const navigate = useNavigate()

  const requestLogin = useUserStore(state => state.requestLogin)

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values)
    requestLogin(values).then(() => {
      navigate(HOME_URL)
    })
  }

  return (
    <StyledRoot>
      <main>
        <div className='form-container'>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </main>
    </StyledRoot>
  )
}

export default Login
