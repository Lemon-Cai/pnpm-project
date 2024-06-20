/*
 * @Author: CP
 * @Date: 2024-06-17 10:40:27
 * @Description:
 */
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

/**
 *
 * @param items
 * @param parentId
 */
async function generateIdsAndParentIds(items, parentId = '-1') {
  const { nanoid } = await import('nanoid')

  let hasNewId = false // 判断是否有重新生成id

  function loop(list, parentId = '-1') {
    list.forEach((item) => {
      // 如果id 不存在 生成唯一的 id
      if (!item.id) {
        item.id = nanoid()
        hasNewId = true
      }

      // item.id = customNanoid()
      // 设置 parentId
      item.parentId = parentId || '-1'

      // 如果有子项，递归调用生成子项的 id 和 parentId
      if (item.children && item.children.length > 0) {
        loop(item.children, item.id)
      }
    })
  }

  loop(items, parentId)

  // 因为是直接改items，items是引用数据类型，可不用返回
  // 返回判断是否有重新生成id，是否更新menus.json文件
  return hasNewId
}

;(async function () {
  const filePath = path.resolve(__dirname, '../mock', 'data', 'menu.json') // 菜单json存放位置

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8') // 读取文件内容
    let menus = JSON.parse(fileContent)
    // 动态生成 id, 请求之后复制到 menu.json中, 已存在的不会在生成
    let flag = await generateIdsAndParentIds(menus)

    // 此时的menus有重新生成的id
    flag && fs.writeFileSync(filePath, JSON.stringify(menus, null, 2))
  } catch (err) {
    console.error('读取文件出错:', err)
  }
})()
