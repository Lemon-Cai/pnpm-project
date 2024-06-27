import { Navigate } from 'react-router-dom'

import { useGlobalStore } from '@/store'
import AuthRouter from '@/components/AuthRouter'

import Classic from './Classic'
import Columns from './Columns'
import Vertical from './Vertical'

const Layout = () => {
  // 纵向：vertical | 经典：classic | 分栏：columns
  const layout = useGlobalStore((state) => state.layout)

  if (layout === 'vertical') {
    return (
      <AuthRouter>
        <Vertical />
      </AuthRouter>
    )
  } else if (layout === 'columns') {
    return (
      <AuthRouter>
        <Columns />
      </AuthRouter>
    )
  } else if (layout === 'classic') {
    return (
      <AuthRouter>
        <Classic />
      </AuthRouter>
    )
  }

  return <Navigate to="/404" />
}

export default Layout
