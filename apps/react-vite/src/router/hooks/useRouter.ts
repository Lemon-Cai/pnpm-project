/*
 * @Author: CP
 * @Date: 2024-06-28 10:12:16
 * @Description:
 */
import { createHashRouter } from 'react-router-dom'
import useRoutes from './useRoute'
import { useMemo } from 'react'

const useRouter = () => {
  const routes = useRoutes()

  return useMemo(() => {
    if (routes?.length <= 0) {
      return null
    }
    return createHashRouter(routes)
  }, [routes])
}

export default useRouter
