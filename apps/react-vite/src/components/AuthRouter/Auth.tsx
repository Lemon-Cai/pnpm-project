/*
 * @Author: CP
 * @Date: 2024-06-27 15:58:46
 * @Description: 
 */
import { startTransition } from 'react'

import { useMenuStore } from '@/store'
import useMounted from '@/hooks/useMounted'
import Loading from '@/components/Loading'

const Auth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  //
  const isLoaded = useMenuStore((state) => state.isInitialized)
  const getAllMenus = useMenuStore((state) => state.getAllMenus)

  // 4、初始化动态菜单路由 ====> 得保证所有的hooks在顶部执行
  useMounted(() => {
    if (!isLoaded) {
      // 看看直接路由跳转会不会执行到这里
      console.log('12311414141441555')
      startTransition(() => {
        getAllMenus()
      })
    }
  })

  if (!isLoaded) {
    return <Loading fullscreen />
  }

  return children
}

export default Auth
