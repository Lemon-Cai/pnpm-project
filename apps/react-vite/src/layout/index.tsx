import { Navigate } from 'react-router-dom'

import { useGlobalStore } from '@/store'

import Classic from './Classic'
import Columns from './Columns'
import Vertical from './Vertical'

const Layout = () => {
  // 纵向：vertical | 经典：classic | 分栏：columns
  const layout = useGlobalStore((state) => state.layout)

  if (layout === 'vertical') {
    return <Vertical />
  } else if (layout === 'columns') {
    return <Columns />
  } else if (layout === 'classic') {
    return <Classic />
  }

  return <Navigate to="/404" />
}

export default Layout
