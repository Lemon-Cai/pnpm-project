import { track, trigger } from './effect'

const isObject = (obj: any) => obj !== null && typeof obj === 'object' 

export const reactive = < T extends object >(target: T) => {
  return new Proxy(target, {
    get (target, key, receiver) {
      let res = Reflect.get(target, key, receiver) as object
      track(target, key)
      if (isObject(res)) {
        return reactive(res)
      }
      return res
    },
    set (target, key, value, receiver) {
      let res = Reflect.set(target, key, value, receiver)
      trigger(target, key)

      return res
    }
  })
}