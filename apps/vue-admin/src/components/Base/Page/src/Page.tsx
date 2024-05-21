/*
 * @Author: CP
 * @Date: 2023-12-05 17:14:50
 * @Description:
 */
import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'

export const basicProps = () => ({
  // see: https://cn.vuejs.org/guide/components/props.html
   // boolean 的 默认值是 false， 除非显示指定默认值 为 undefined
  vertical: { type: Boolean, default: undefined as undefined },
  hasSider: { type: Boolean}
})

export default defineComponent({
  name: 'CPage',
  // props: basicProps(),
  setup(props, { slots }) {

    return () => (
      <Layout
        class="page"
        v-slots={slots}
      >
        {/* {
          slots.sider && cloneVNode(renderSlot(slots, 'sider'), {
            class: 'page_sider'
          })
        }
        {
          slots.header && cloneVNode(renderSlot(slots, 'content'), {
            class: 'page_header'
          })
        }
        {
          cloneVNode(slots.content ? renderSlot(slots, 'content') : renderSlot(slots, 'default'), {
            class: 'page_content'
          })
        }
        {
          slots.header && cloneVNode(renderSlot(slots, 'footer') , {
            class: 'page_footer'
          })
        } */}
      </Layout>
    )
  }
})
