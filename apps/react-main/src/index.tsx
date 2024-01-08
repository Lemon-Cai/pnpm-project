/*
 * @Author: CP
 * @Date: 2023-11-03 09:47:33
 * @Description: 
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { useLocation, useNavigationType, matchRoutes, createRoutesFromChildren } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/locale/zh_CN'

import * as Sentry from '@sentry/react'

import { Ion } from 'cesium'

import { initStoreConfig } from '@/config/localForage'

import App from './App'
import ErrorPage from './pages/ErrorPage';
import reportWebVitals from './reportWebVitals';
import workers from './mock';

import './index.scss';


// 初始化localforage配置
initStoreConfig()

// 开发环境启动 mock
if (process.env.NODE_ENV === 'development') {
  // workers.listen();
  workers.start({
    onUnhandledRequest: 'bypass',
  });
}

// 设置 cesium 的 token
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZjJhNTE5MS0zYWE1LTQ3ZmYtOGJlMi1kZGYxNjgxYzkzNDgiLCJpZCI6MTUxNCwiaWF0IjoxNTI4ODAyNDgzfQ.zztxOqEyecGP01FA0yY2dRu8IMXGhjh0KQ5AcqblT68'

Sentry.init({
  dsn: "https://ffbf06b3d609984c50227efaff1c59f4@o4506006906798080.ingest.sentry.io/4506007612882944",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      // tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!

  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ConfigProvider locale={zh_CN}>
    <React.StrictMode>
      <Sentry.ErrorBoundary fallback={<ErrorPage />}>
        <App />
      </Sentry.ErrorBoundary>
    </React.StrictMode>
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
