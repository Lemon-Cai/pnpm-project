/*
 * @Author: CP
 * @Date: 2023-12-05 17:14:57
 * @Description: 
 */
import { defineComponent, /* cloneVNode,  renderSlot, toRefs */ } from "vue";
import { ElHeader } from "element-plus";

export default defineComponent({
  name: 'CHeader',
  // compatConfig: { MODE: 3 }, // 兼容性
  setup(props, { slots }) {
    // const {
    //   className,
    //   ...restProps
    // } = toRefs(props)
    return () => (
      <ElHeader v-slots={slots}>
        {/* { cloneVNode(renderSlot(slots, 'default'), null, true) } */}
      </ElHeader>
    )
  }
})