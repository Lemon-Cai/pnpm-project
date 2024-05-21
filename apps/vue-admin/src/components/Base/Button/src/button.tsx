/*
 * @Author: CP
 * @Date: 2024-05-21 09:42:41
 * @Description: 
 */
import { defineComponent } from "vue";
import { Button as AButton } from 'ant-design-vue'

export default defineComponent({
  name: "CButton",
  setup (props, { slots }) {
    // console.log(props)
    return () => (
      <AButton v-slots={slots}>
        {/* {{
          default: () => slots.default ? slots.default() : null
        }} */}
      </AButton>
    )
  }
})
