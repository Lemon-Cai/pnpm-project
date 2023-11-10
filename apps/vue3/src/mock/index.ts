/*
 * @Author: CP
 * @Date: 2023-11-10 17:10:46
 * @Description: 
 */
import Mock from 'mockjs'  //导入mockjs

import flights from './data/flingts.json'

Mock.mock('/api/getFlightsData', 'get', () => {
  return {
    status:200, //请求成功状态码
    // dataList: {
    //   msg: '',
    //   data: flights,
    //   code: 200
    // } //模拟的请
    data: flights
  }
})