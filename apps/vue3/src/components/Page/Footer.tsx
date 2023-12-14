import { defineComponent } from "vue";
import { ElFooter } from "element-plus";

export default defineComponent({
  name: 'CFooter',
  setup(props, { slots }) {
    return () => (
      <ElFooter v-slots={slots}>
        {/* { cloneVNode(renderSlot(slots, 'default'), null, true) } */}
      </ElFooter>
    )
  }
})