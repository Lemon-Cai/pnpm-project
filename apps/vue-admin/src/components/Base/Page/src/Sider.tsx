/**
 * @Author: CP
 * @Date: 2023-12-05 17:15:06
 * @Description: 
 */
import { defineComponent } from "vue";
import { LayoutSider } from "ant-design-vue";

export default defineComponent({
  name: 'CSider',
  setup(props, { slots }) {
    return () => (
      <LayoutSider v-slots={slots}>
      </LayoutSider>
    )
  }
})