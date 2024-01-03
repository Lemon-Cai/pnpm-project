/*
 * @Author: CP
 * @Date: 2023-11-22 10:49:46
 * @Description: 
 */
import { http, HttpResponse, delay } from 'msw'
import {nanoid} from 'nanoid'
import type { MenuObject } from '@/types/menu'

// const generateMenuData = (menus: MenuObject[]): MenuObject[] => {
//   const results: MenuObject[] = []

//   function loop (list: MenuObject[], parentId: string = '-1') {
//     for (const item of list) {
//       let id = nanoid()
//       item.id = id
//       item.parentId = parentId || '-1'

//       results.push({...item})

//       if (item.children && item.children.length > 0) {
//         loop(item.children, id)
//       }
      
//     }
//   }

//   loop(menus)

//   return results
// }

function generateIdsAndParentIds(items: MenuObject[], parentId: string = '-1') {
  items.forEach((item, index) => {
    // 如果id 不存在 生成唯一的 id
    !item.id && (item.id = nanoid())

    // 设置 parentId
    item.parentId = parentId || "-1";

    // 如果有子项，递归调用生成子项的 id 和 parentId
    if (item.children && item.children.length > 0) {
      generateIdsAndParentIds(item.children, item.id);
    }
  });
}

const handlers = [
  http.post('/mock/login', async ({ request, params }) => {
    // 等待200ms
    delay(200)
    console.log(params, request)

    return HttpResponse.json(
      {
        msg: '',
        success: true,
        code: 200,
        data: {
          // 个人信息
          accessToken: '',
          username: 'admin',
          pwd: '123456'
        }
      },
      {
        status: 200
      }
    )
  }),
  http.post('/mock/getAllMenu', async ({ request, params }) => {
    // 等待200ms
    // delay(200)
    console.log(params, request)

    const menus = require('../data/menu.json')
    console.log('allMenus', menus);

    // 动态生成 id, 请求之后复制到 menu.json中, 已存在的不会在生成
    generateIdsAndParentIds(menus) // menus.map((menu: MenuObject) => menu)


    return HttpResponse.json(
      {
        msg: '',
        success: true,
        data: menus
      },
      {
        status: 200
      }
    )
  })
]

export default handlers