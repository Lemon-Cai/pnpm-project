/*
 * @Author: CP
 * @Date: 2024-06-26 09:11:10
 * @Description: 判断访问是否有权限
 */

// import { startTransition } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { getToken } from '@/utils/store'
import { LOGIN_URL } from '@/config/constants'
// import { useMenuStore } from '@/store'
// import Loading from '@/components/Loading'
// import useMounted from '@/hooks/useMounted'

import Auth from './Auth'

interface AuthRouterImpl {
  children: React.ReactNode
}

// 定义认证上下文类型
// interface AuthContextType {
//   isAuthenticated: boolean;
//   setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
// }

// 提供默认值 null
// const AuthContext = createContext<AuthContextType | null>(null);

const AuthRouter: React.FC<AuthRouterImpl> = ({ children }) => {
  let { state } = useLocation()

  // 1、移除所有在等待中的请求

  // 2、判断是否需要认证，没有登录访问去登录页
  if (state?.meta?.isAuth === false) return children

  // 3、判断是否有token权限
  let token = getToken()
  if (!token) {
    // 鉴权失败
    return <Navigate to={LOGIN_URL} replace />
  }

  return <Auth>{children}</Auth>
}

export default AuthRouter

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = getToken();
//     if (token) {
//       // 验证 token 逻辑
//       setIsAuthenticated(true);
//     } else {
//       setIsAuthenticated(false);
//       navigate('/login');
//     }
//   }, [navigate]);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
