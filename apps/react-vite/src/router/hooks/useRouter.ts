/*
 * @Author: CP
 * @Date: 2024-06-28 10:12:16
 * @Description:
 */
import { createHashRouter } from 'react-router-dom'
import useRoutes from './useRoute'

const useRouter = () => {
  const routes = useRoutes()

  return createHashRouter(routes)
}

export default useRouter
