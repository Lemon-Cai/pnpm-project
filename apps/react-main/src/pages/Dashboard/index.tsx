/*
 * @Author: CP
 * @Date: 2023-12-14 16:33:41
 * @Description: 
 */

import {
  useLogin
} from '@/store/reducer/login'
import { useEffect } from 'react';


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

    // dispatch('getData')
  // eslint-disable-next-line
  }, [])

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