import localForage from 'localforage'
import Cookies, { CookieAttributes } from 'js-cookie'

import { STORE_PREFIX } from '@/config/constants'

export const getToken = (key = 'access_token') => {
  return localForage.getItem(`${STORE_PREFIX}${key}`)
}

// =======Cookie==========
/**
 * 设置 Cookie
 * @param key
 */

export const getCookie = (key: string) => {
  return Cookies.get(`${STORE_PREFIX}${key}`)
}
/**
 * 获取 Cookie
 * @param key
 * @param value
 * @param options
 */
export const setCookie = (key: string, value: any, options: CookieAttributes = {}) => {
  Cookies.set(`${STORE_PREFIX}${key}`, value, options)
}
/**
 * 删除 Cookie
 * @param key
 */
export const removeCookie = (key: string) => {
  Cookies.remove(`${STORE_PREFIX}${key}`)
}

// 检查是否存在 Cookie
export function hasCookie(key: string) {
  return Cookies.get(`${STORE_PREFIX}${key}`) !== undefined
}

// 获取所有 Cookie
export function getAllCookies() {
  return Cookies.get()
}

// ======== Session ==========

export const getSession = () => {}
export const setSession = () => {}
export const removeSession = () => {}
export const removeAllSession = () => {}

// =======Store==========
/**
 * 初始化配置 localforage
 * @param config
 */
export const initStoreConfig = (config: LocalForageOptions = {}) => {
  localForage.config({
    driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE, localForage.WEBSQL], // WEBSQL 可能存在兼容性问题
    name: 'CPTech_DB', // 数据库名
    storeName: 'store', // 存储空间名
    version: 1, // 数据库版本
    description: 'application 本地存储',
    ...config
  })
}

/**
 * 根据key获取store中数据
 * @param key
 */
export const getStore = (key: string) => {
  return localForage.getItem(`${STORE_PREFIX}${key}`)
}

/**
 * 获取所有的
 * @returns 
 */
export const getAllStore = async () => {
  let keys = await localForage.keys()
  
  const resultObj = Object.fromEntries(
    keys.map(key => {
      let value = localForage.getItem(key)
      
      return [
        key.replace(STORE_PREFIX, ''),
        value
      ]
    })
  )
  // localForage
  //   .keys()
  //   .then(function (keys) {
  //     // 包含所有 key 名的数组
  //     console.log(keys)
  //   })
  //   .catch(function (err) {
  //     // 当出错时，此处代码运行
  //     console.log(err)
  //   })
  return resultObj
}

/**
 *
 * @param key
 * @param data
 */
export const setStore = (key: string, data: any) => {}

export const removeStore = (key: string) => {}

/**
 * 删除所有的缓存
 */
export const removeAllStore = () => {
  localForage.clear()
}
