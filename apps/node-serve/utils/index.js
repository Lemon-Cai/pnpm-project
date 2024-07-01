/*
 * @Author: CP
 * @Date: 2024-06-24 09:08:57
 * @Description:
 */

const { customAlphabet } = require('./nanoid')

const customNanoid = customAlphabet('1234567890', 21)

/**
 *
 * @param items
 * @param parentId
 */
function generateIdsAndParentIds(items, parentId = '-1') {
  // const { customAlphabet } = await import('nanoid')
  // const customNanoid = customAlphabet('1234567890', 21)

  let hasNewId = false // 判断是否有重新生成id

  async function loop(list, parentId = '-1') {
    for (item of list) {
      // 如果id 不存在 生成唯一的 id
      if (!item.id) {
        item.id = customNanoid()
        hasNewId = true
      }

      // item.id = customNanoid()
      // 设置 parentId
      item.parentId = parentId || '-1'

      // 如果有子项，递归调用生成子项的 id 和 parentId
      if (item.children && item.children.length > 0) {
        loop(item.children, item.id)
      }
    }
    // list.forEach(async (item) => {

    // })
  }

  loop(items, parentId)

  // 因为是直接改items，items是引用数据类型，可不用返回
  // 返回判断是否有重新生成id，是否更新menus.json文件
  return hasNewId
}

module.exports = {
  generateIdsAndParentIds
}
