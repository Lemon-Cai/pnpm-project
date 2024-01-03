/*
 * @Author: CP
 * @Date: 2023-11-03 09:47:33
 * @Description: 
 */
import { MyMenuItem } from '@/types/menu'

/**
 * 
 * @param val 
 * @returns 
 */
export const isEmpty = (val: Object | Array<any>) => {
  if (isObject(val)) {
    return Object.keys(val).length === 0
  } else if (Array.isArray(val)) {
    return val.length === 0
  }
  return false
}

export const getType = (val: any): String => {
  return Object.prototype.toString.call(val).slice(8, -1)
}

/**
 * 是否是对象
 * @param val 
 * @returns 
 */
export const isObject = (val: any): Boolean => {
  return getType(val) === 'Object'
}

// /**
//  * 是否是数组
//  * @param val 
//  * @returns 
//  */
// export const isArray = (val: any): Boolean => {
//   return Array.isArray(val)
// }

/**
 * 是否是日期
 * @param val 
 * @returns 
 */
export const isDate = (val: any): Boolean => {
  return getType(val) === 'Date'
}

/**
 * 是否是函数
 * @param val 
 * @returns 
 */
export const isFunction = (val: any): Boolean => {
  return getType(val) === 'Function'
}

/**
 * 
 * @param tree 
 * @param key 
 * @returns 
 */
export const findParentKeyPath = (tree: MyMenuItem[], key: string): string[] => {
  let path: string[] = [];
  function dfs (node: MyMenuItem, currPath: string[]) {
    if (node.key) {
      currPath.push(node.key as string);
      // 如果当前节点的key等于目标key，则保存当前路径
      if (node.key === key) {
        path = [...currPath];
      }
      
      // 递归搜索当前节点的子节点
      if (node?.children) {
        for (let child of node.children) {
          dfs(child, currPath);
        }
      }
      
      // 回溯，将当前节点从路径中移除
      currPath.pop();
    }
  }
  for (const node of tree) {
    dfs(node, path)
  }
  path.pop() // 去掉当前节点
  return path
}

export const generateMenu = () => {}