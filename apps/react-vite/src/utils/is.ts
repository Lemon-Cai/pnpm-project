/*
 * @Author: CP
 * @Date: 2024-02-22 15:48:09
 * @LastEditors: Please set LastEditors
 * @Description:
 */
/**
 * @description: 判断值是否是某个类型
 * @example is(val, 'Number')
 * @returns boolean
 */
export function is(val: any, type: string): boolean {
  return Object.prototype.toString.call(val) === `[object ${type}]`
}

export function isObject(val: any): boolean {
  return is(val, 'Object')
}

export function isArray(val: unknown): boolean {
  if (Array.isArray) return Array.isArray(val)
  return is(val, 'Array')
}

export function isUndefined(val: unknown) {
  return is(val, 'Undefined')
}

export function isNumber(val: unknown) {
  return is(val, 'Number')
}

export function isString(val: unknown) {
  return is(val, 'String')
}

export const isStringNumber = (val: unknown) => {
  if (!isString(val)) {
    return false
  }
  return !Number.isNaN(Number(val))
}

/**
 * 是否是日期
 * @param val 
 * @returns 
 */
export const isDate = (val: any): boolean => {
  return is(val, 'Date')
}

/**
 * 是否是函数
 * @param val 
 * @returns 
 */
export const isFunction = (val: any): boolean => {
  return is(val, 'Function')
}



/**
 * 校验 传值 val 是否存在内容
 * @param {*} val
 * @returns
 */
export function isEmpty(val: any) {
  if (is(val, 'Number')) return String(val) === 'NaN'
  if (is(val, 'String')) return val === ''
  if (is(val, 'Undefined')) return true
  if (is(val, 'Null')) return true
  if (isArray(val)) return val!.length === 0
  if (isObject(val)) return Object.keys(val).length === 0
  return false
}

export function isBlank(val: unknown) {
  if (val !== null && typeof val !== 'undefined') {
    return val
  }
  return '-'
}
