/**
 * @Author: CP
 * @Date: 2023-12-05 17:15:06
 * @Description: 
 */
import { defineComponent } from "vue";
import { ElMain } from "element-plus";

export default defineComponent({
  name: 'CContent',
  setup(props, { slots }) {
    return () => (
      <ElMain v-slots={slots}>
      </ElMain>
    )
  }
})