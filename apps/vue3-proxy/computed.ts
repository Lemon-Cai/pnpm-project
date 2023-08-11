import  { effect } from './effect'

export const computed = (getter: Function) => {
  let _value = effect(getter, {
    scheduler: () => {
      _dirty = true
    }
  })
  let cacheValue;
  let _dirty = true
  class ComputedRefImpl {
    get value () {
      if ( _dirty) {
        cacheValue = _value()
        _dirty = false
      }
      return cacheValue
    }
  }
  return new ComputedRefImpl()
}