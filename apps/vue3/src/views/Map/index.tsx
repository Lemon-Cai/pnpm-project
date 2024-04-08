/*
 * @Author: CP
 * @Date: 2024-01-08 20:35:06
 * @LastEditors: Please set LastEditors
 * @Description: 
 */
import { defineComponent, withModifiers, ref } from 'vue'

export default defineComponent({
  name: 'mapPage',
  setup(props, { attrs, slots }) {
    console.log(props)

    const { title, defaultExpand = true, ...other_attrs } = attrs

    const expand = ref<boolean>(defaultExpand as boolean)

    const handleClickBox = (evt: MouseEvent) => {
      console.log('jsx时，需要使用修饰符，需要借助于 withModifiers ', evt)
    }

    const toggleExpand = () => {
      expand.value = !expand.value

      console.log('toggleExpand')
    }

    return () => (
      <div>
        map
        <div class={'box3'} onClick={withModifiers((e: MouseEvent) => handleClickBox(e), ['stop'])}>
          我是box3
        </div>
        <div
          // class={style.collapseContainer}
          onClick={toggleExpand}
          {...other_attrs}
        >
          <div {...{ 'data-target': 'left' }}>
            {slots.leftIcon ? slots.leftIcon(expand.value) : null}
          </div>
          <div {...{ 'data-target': 'title' }}>{title}</div>
          {slots.rightIcon ? <div {...{ 'data-target': 'right' }}>{slots.rightIcon()}</div> : null}
        </div>
      </div>
    )
  }
})
