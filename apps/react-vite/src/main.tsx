/*
 * @Author: CP
 * @Date: 2024-01-08 20:35:06
 * @Description: 
 */
import React from 'react'
import ReactDOM from 'react-dom/client'

import '@/styles/main.scss'

// import workers from 'mock/index.ts'
import App from './App.tsx'
// import './index.css'

// 开发环境启动 mock
if (process.env.NODE_ENV === 'development') {
  // workers.listen();
  // workers.start({
  //   onUnhandledRequest: 'bypass',
  // });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
