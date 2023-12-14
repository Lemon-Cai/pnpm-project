import { defineComponent, withModifiers } from 'vue'

export default defineComponent({
  name: 'mapPage',
  setup(props) {
    console.log(props)

    const handleClickBox = (evt: MouseEvent) => {
      console.log('jsx时，需要使用修饰符，需要借助于 withModifiers ', evt)
    }

    return () => (
      <div>
        map
        <div class={'box3'} onClick={withModifiers((e: MouseEvent) => handleClickBox(e), ['stop'])}>
          我是box3
        </div>
      </div>
    )
  }
})
