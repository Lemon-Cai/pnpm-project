/*
 * @Author: CP
 * @Date: 2023-12-05 17:14:57
 * @Description: 
 */
import { defineComponent, /* cloneVNode,  renderSlot, toRefs */ } from "vue";
import { LayoutHeader } from "ant-design-vue";

export default defineComponent({
  name: 'CHeader',
  // compatConfig: { MODE: 3 }, // 兼容性
  setup(props, { slots }) {
    // const {
    //   className,
    //   ...restProps
    // } = toRefs(props)
    return () => (
      <LayoutHeader v-slots={slots}>
        {/* { cloneVNode(renderSlot(slots, 'default'), null, true) } */}
      </LayoutHeader>
    )
  }
})