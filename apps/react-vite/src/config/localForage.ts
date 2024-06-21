
import localForage from 'localforage'

const DB_NAME = 'CPTech_DB'
const STORE_NAME = 'CPTech_store'

/**
 * 初始化配置 localforage
 * @param config
 */
export const initStoreConfig = (config: LocalForageOptions = {}) => {
  localForage.config({
    driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE, localForage.WEBSQL], // WEBSQL 可能存在兼容性问题
    name: DB_NAME, // 数据库名
    storeName: STORE_NAME, // 存储空间名
    version: 1, // 数据库版本
    description: 'application 本地存储',
    ...config
  })
}

export default localForage