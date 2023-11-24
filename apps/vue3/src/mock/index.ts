/*
 * @Author: CP
 * @Date: 2023-11-10 17:10:46
 * @Description: 
 */
// import Mock from 'mockjs'  //导入mockjs
import { setupWorker } from 'msw/browser'

import { uploadHandlers, loginHandlers, mapHandlers } from './handlers'

// import flights from './data/flingts.json'

// Mock.mock('/mock/getFlightsData', 'get', () => {
//   return {
//     status:200, //请求成功状态码
//     // dataList: {
//     //   msg: '',
//     //   data: flights,
//     //   code: 200
//     // } //模拟的请
//     data: flights
//   }
// })

// Mock.mock(/\/mock\/allcore\/checkFolder/, 'get', (request) => {
//   console.log(this, request);
//   if (request.body) {
//     let data = JSON.parse(request.body)
//     return {
//       status:200, //请求成功状态码
//       msg: '',
//       success: true,
//       data: {
//         successList: data.fileFolder,
//       }
//     }
//   }
//   return {
//     status:200, //请求成功状态码
//     msg: '',
//     success: true,
//     data: {
//       successList: [],
//     }
//   }
// })

// Mock.mock(/\/mock\/allcore\/upload/, 'get', (options) => {
//   let data
//   if (options.body) {
//     data = JSON.parse(options.body)
//   }
//   return {
//     status:200, //请求成功状态码
//     msg: '',
//     success: true,
//     data: {
//       ...data,
//     }
//   }
// })

const workers = setupWorker(...uploadHandlers, ...loginHandlers, ...mapHandlers)

export default workers
