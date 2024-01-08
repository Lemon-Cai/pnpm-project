// import { HttpResponse } from 'msw'
import { customAlphabet, nanoid } from 'nanoid'
// import * as jwt from 'jsonwebtoken'
import type { MenuObject } from '@/types/menu'
// import { SECRET } from '@/config/constants'
// 自定义创建长度 21 ,集合 [ 1234567890 ] 的随机字符串
const customNanoid = customAlphabet('1234567890', 21)

console.log(customNanoid())

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

/**
 * 
 * @param items 
 * @param parentId 
 */
export function generateIdsAndParentIds(items: MenuObject[], parentId: string = '-1') {
  items.forEach((item, index) => {
    // 如果id 不存在 生成唯一的 id
    !item.id && (item.id = nanoid())

    // item.id = customNanoid()
    // 设置 parentId
    item.parentId = parentId || '-1'

    // 如果有子项，递归调用生成子项的 id 和 parentId
    if (item.children && item.children.length > 0) {
      generateIdsAndParentIds(item.children, item.id)
    }
  })
}

/**
 * 生成 token，并设置过期时间为 1 小时
 * @param user 
 */
export const generateToken = (user: { id: number; username: string }) => {
  // return jwt.sign({ userId: user.id, username: user.username }, SECRET, { expiresIn: '12h' })
}

// const _verify = (token: string) => {
//   return new Promise((resolve, reject) => {
//     // 验证 token 是否有效
//     jwt.verify(token, SECRET, (err: any, decoded: any) => {
//       if (err) {
//         reject({ msg: 'Invalid token' })
//         // return HttpResponse.json({ msg: 'Invalid token' }, { status: 401 })
//       }

//       // 检查 token 是否过期
//       if (decoded.exp < Date.now() / 1000) {
//         reject({ msg: 'Token has expired' })
//         // return HttpResponse.json({ msg: 'Token has expired' }, { status: 401 })
//       }

//       // 返回模拟的受保护路由数据
//       resolve({ msg: 'successfully' })
//       // return HttpResponse.json({ msg: 'Protected route accessed successfully' })
//     })
//   })
// }

export const verifyToken = (resolver: (arg0: any) => any) => {
  return async (input: { request: any }) => {
//     const { request } = input

//     const token = request.headers.get('token')
//     if (!token) {
//       return new HttpResponse(null, { status: 401 })
//     }

//     try {
//       const res = await _verify(token)
//       console.log('校验成功', res)
//     } catch (error) {
//       console.log('error', error)
//       return new HttpResponse(null, { status: 401 })
//     }

//     // const authorization = request.headers.get('Authorization')

//     // if (!authorization) {
//     //   return new HttpResponse(null, { status: 401 })
//     // }

//     return resolver(input)
  }
}
