import Cookies, { CookieAttributes } from 'js-cookie'
import localForage from '@/config/localForage'

import { STORE_PREFIX } from '@/config/constants'

/**
 * 获取token
 * @param key 
 * @returns 
 */
export const getToken = (key = 'access_token') => {
  return getCookie(key)
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

/**
 * 获取 sessionStorage
 * @param key 
 * @returns 
 */
export const getSession = (key: string) => {
  let obj = sessionStorage.getItem(`${STORE_PREFIX}${key}`)
  try {
    return JSON.parse(obj as string)?.data
  } catch (error) {
    return obj
  }
}

/**
 * 
 * @param key 
 * @param data 
 */
export const setSession = (key: string, data: any) => {
  let newData = JSON.stringify({
    data,
    time: +new Date()
  })
  sessionStorage.setItem(`${STORE_PREFIX}${key}`, newData)
}

/**
 * 
 * @param key 
 */
export const removeSession = (key: string) => {
  key && sessionStorage.removeItem(`${STORE_PREFIX}${key}`)
}

/**
 * 
 */
export const removeAllSession = () => {
  sessionStorage.clear()
}

// =======Store==========

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
export const setStore = (key: string, data: any) => {
  localForage.setItem(`${STORE_PREFIX}${key}`, data)
}

export const removeStore = (key: string) => {
  localForage.removeItem(`${STORE_PREFIX}${key}`)
}

/**
 * 删除所有的缓存
 */
export const removeAllStore = () => {
  localForage.clear()
}
