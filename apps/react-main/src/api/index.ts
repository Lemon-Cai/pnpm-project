/*
 * @Author: CP
 * @Date: 2023-12-15 15:24:32
 * @Description:
 */
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig
} from 'axios'
import nProgress from 'nprogress'
import { message } from 'antd'

import { getToken } from '@/utils/store'
import { AUTHORITY, TOKEN } from '@/config/constants'
import { checkStatus } from './helper/checkStatus'
import { ResultData } from './interface'

const BASE_CONFIG = {
  timeout: 60 * 1e3,
  // 跨域时候允许携带凭证
  withCredentials: true,
  baseUrl: ''
}

class HttpRequest {
  BASE_CONFIG = {
    timeout: 60 * 1e3,
    // 跨域时候允许携带凭证
    withCredentials: true,
    baseUrl: ''
  }

  axiosInstance: AxiosInstance

  public constructor(config?: AxiosRequestConfig) {
    this.axiosInstance = axios.create({ ...this.BASE_CONFIG, ...config })

    this.axiosInstance.interceptors.request.use(
      function (config: InternalAxiosRequestConfig) {
        // 创建进度条
        nProgress.start()

        config.headers['Authorization'] = `${AUTHORITY} xxxxxxxx` // 默认带上鉴权信息

        const meta = (config as any).meta || {}
        const isAuth = meta.isAuth === false

        // 获取token，在 请求头中塞 token
        const token = getToken()
        if (isAuth && !!token) {
          config.headers['token'] = `${TOKEN} ${token}`
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, config } = response
        nProgress.done()

        if (response.status !== 200) {
          //
        }

        if (data.code !== 200) {
          
          // 请求失败状态
          return Promise.reject(data)
        }

        // 是否是下载文件
        const isDownload = (config as any).meta?.isDownload
        if (isDownload) {
          return response
        }
        return data
      },
      async (error: AxiosError) => {
        const { response } = error
        nProgress.done()
        // 请求超时单独判断，请求超时没有 response
        if (error.message.indexOf('timeout') !== -1) message.error('请求超时，请稍后再试')
        // 根据响应的错误状态码，做不同的处理
        if (response) checkStatus(response.status)
        // 服务器结果都没有返回(可能服务器错误可能客户端断网) 断网处理:可以跳转到断网页面
        // if (!window.navigator.onLine) window.location.hash = "/500";
        return Promise.reject(error)
      }
    )
  }

  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.axiosInstance.get(url, { params, ..._object })
  }

  post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.axiosInstance.post(url, params, _object)
  }
  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.axiosInstance.put(url, params, _object)
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.axiosInstance.delete(url, { params, ..._object })
  }
}

const http = new HttpRequest(BASE_CONFIG)

export default http
