/*
 * @Author: CP
 * @Date: 2023-11-03 09:47:33
 * @Description: 
 */
import { useEffect, useRef } from "react"

import useEffectOnce from './useEffectOnce'

const useMount = (fn: () => void) => {
  const isMounted = useRef<boolean>(false)
  useEffect(() => {
    isMounted.current = true
    return () => {
      // isMounted.current = true
    }
  }, [])
  
  // useEffect(() => {
  //   let deMounted = () => {}
  //   if (!isMounted.current) {
  //     deMounted = fn?.() as any
  //     if (typeof deMounted === 'function') return deMounted
  //   }
  //   return deMounted
  // }, []) // eslint-disable-line

  useEffectOnce(() => {
    fn?.()
  })
}

export default useMount