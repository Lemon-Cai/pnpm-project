/*
 * @Author: CP
 * @Date: 2024-05-15 10:09:38
 * @Description: 
 */
import axios from 'axios'

export const fetchDeviceTree = (params = {}) => {
  return axios.get('/mock/getTree', {
    params
  })
}

export const fetchDeviceTreeOfChildren = () => {
  return axios.get('/mock/getTreeOfChildren', {
    
  })
}

