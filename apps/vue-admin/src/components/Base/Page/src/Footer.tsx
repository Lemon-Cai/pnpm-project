import { defineComponent } from "vue";
import { LayoutFooter } from "ant-design-vue";

export default defineComponent({
  name: 'CFooter',
  setup(props, { slots }) {
    return () => (
      <LayoutFooter v-slots={slots}>
        {/* { cloneVNode(renderSlot(slots, 'default'), null, true) } */}
      </LayoutFooter>
    )
  }
})