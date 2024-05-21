/**
 * @Author: CP
 * @Date: 2023-12-05 17:15:06
 * @Description: 
 */
import { defineComponent } from "vue";
import { LayoutContent } from "ant-design-vue";

export default defineComponent({
  name: 'CContent',
  setup(props, { slots }) {
    return () => (
      <LayoutContent v-slots={slots}>
      </LayoutContent>
    )
  }
})