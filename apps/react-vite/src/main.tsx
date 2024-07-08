/*
 * @Author: CP
 * @Date: 2024-01-08 20:35:06
 * @Description: 
 */
import React from 'react'
import ReactDOM from 'react-dom/client'

import { Ion } from 'cesium'

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

// 设置 cesium 的 token
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZjJhNTE5MS0zYWE1LTQ3ZmYtOGJlMi1kZGYxNjgxYzkzNDgiLCJpZCI6MTUxNCwiaWF0IjoxNTI4ODAyNDgzfQ.zztxOqEyecGP01FA0yY2dRu8IMXGhjh0KQ5AcqblT68'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
