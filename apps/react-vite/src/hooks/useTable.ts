// import { useState, useEffect } from 'react'

type ConfigT = {
  [key: string]: any
}

// const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

const useTable = (config: ConfigT) => {

  console.log(config);
  // const {
  //   apiFn,
  //   queryParams,
  //   columns = [],
  //   transform,
  //   immediate = true,
  // } = config

  // const [pagination] = useState({
  //   pageSizeOptions: PAGE_SIZE_OPTIONS,
  //   pageSize: 10, // 每页条数
  //   current: 1 // 当前页数
  // })

  // const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   if (immediate) {
  //     _getData()
  //   }
  // }, [])

  // const _getData = async () => {
  //   setLoading(true)
  //   let res = await apiFn({ ...queryParams, ...pagination })
  //   if (typeof transform === 'function') {
  //     res = transform(res)
  //   }

  // }

  // return {
  //   columns,
  //   loading
  // }
}

export default useTable