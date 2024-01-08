/*
 * @Author: CP
 * @Date: 2024-01-08 15:47:21
 * @Description: 
 */
import { useEffect, useRef } from "react"

const useMounted = (fn: () => void) => {
  const isMounted = useRef<boolean>(false)

  useEffect(() => {
    if (isMounted.current) {
      fn?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted.current])

  useEffect(() => {
    isMounted.current = true
    return () => {
      // isMounted.current = false
    }
  }, [])


}

export default useMounted