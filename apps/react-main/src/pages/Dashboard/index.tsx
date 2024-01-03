/*
 * @Author: CP
 * @Date: 2023-12-14 16:33:41
 * @Description: 
 */

import {
  useLogin
} from '@/store/reducer/login'
import { useEffect } from 'react';

import http from '@/api'
import { message } from 'antd';



console.log('Login', useLogin);

const Dashboard = () => {

  const { userInfo, requestLogin /* status, data, getData */} = useLogin()

  // const dispatch = useLogin((state) => state.dispatch)

  useEffect(() => {
    console.log('userInfo======', userInfo);
    // getData?.('react')
    requestLogin({
      username: 'admin',
      password: 'admin'
    })

    _getAllMenu()
    // dispatch('getData')
  // eslint-disable-next-line
  }, [])

  const _getAllMenu = () => {
    http.post('/mock/getAllMenu').then((response) =>{
      const { success, data, msg } = response
      if (success) {
        console.log('data', data);
      } else {
        message.error(msg || '请求失败, 请稍后重试')
      }
    }).catch((res) => {
      console.log('222222222', res);
    })
  }

  return (
    <div>
      门户
      {/* { status }
      {
        data?.map((item: any) => (
          <div key={item.id}>{item.full_name}</div>
        ))
      } */}
    </div>
  )
}

export default Dashboard