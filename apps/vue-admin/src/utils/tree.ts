/*
 * @Author: CP
 * @Date: 2024-05-13 17:16:44
 * @Description:
 */
export type TreeNode<T> = T & {
  children?: TreeNode<T>[]
  [key: string]: any // 添加索引签名
}

/**
 * 树数据扁平化
 * @param {*} menu
 * @param {*} childField
 * @returns
 */
export function flatTree<T>(menu: TreeNode<T>[] = [], childField = 'children') {
  return menu.reduce((res: TreeNode<T>[], cur) => {
    if (cur[childField] && cur[childField].length > 0) {
      res.push(...(flatTree(cur[childField], childField) as TreeNode<T>[]))
    }
    res.push(cur)
    return res
  }, [])
}

/**
 * 查找树形数据节点
 * @param {*} tree
 * @param {*} targetValue
 * @param {*} field
 * @param {string} [childField='children']
 * @returns
 */
export function findTreeNode<T>(
  treeData: TreeNode<T>[] = [],
  targetValue: string,
  field = 'id',
  childField = 'children'
) {
  // let result = null

  function findNode(tree: TreeNode<T>): T | null {
    // 如果当前节点的值等于目标值，返回当前节点
    if (tree && tree[field] === targetValue) {
      return tree
    }

    // 遍历当前节点的子节点
    for (const child of tree[childField] || []) {
      // 递归地在子节点中查找目标值
      const found: T | null = findNode(child)
      // 如果找到了，直接返回找到的节点
      if (found) {
        return found
      }
    }

    // 如果在子节点中找不到目标值，则返回 null
    return null
  }

  return findNode({ children: treeData } as TreeNode<T>)
}

/**
 * 根据key获取其所有父节点的函数
 * @param {*} menuTree
 * @param {*} key
 * @param {*} field
 * @returns
 */
export const findParentMenuByKey = <T extends Record<string, unknown>>(
  menuTree: TreeNode<T>[] = [],
  key: string,
  field = 'key'
) => {
  const parentNodes: TreeNode<T>[] = []

  function findParents(currentNode: TreeNode<T>, targetKey: string) {
    if (currentNode[field] === targetKey) {
      return true // 找到目标节点
    }

    for (const childNode of currentNode.children || []) {
      if (findParents(childNode, targetKey)) {
        parentNodes.push(currentNode)
        return true // 找到目标节点的父节点
      }
    }

    return false // 未找到目标节点
  }

  findParents({ children: menuTree } as TreeNode<T>, key)

  parentNodes.reverse().shift() // 反转数组，以便按照从根节点到目标节点的顺序返回
  return parentNodes
}
