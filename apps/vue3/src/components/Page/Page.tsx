/*
 * @Author: CP
 * @Date: 2023-12-05 17:14:50
 * @Description:
 */
import { computed, defineComponent } from 'vue'
import type { Component, ExtractPropTypes, HTMLAttributes, VNode } from 'vue'
import { ElContainer } from 'element-plus'

export const basicProps = () => ({
  // see: https://cn.vuejs.org/guide/components/props.html
   // boolean 的 默认值是 false， 除非显示指定默认值 为 undefined
  vertical: { type: Boolean, default: undefined as undefined }
})

export type PageProps = Partial<ExtractPropTypes<ReturnType<typeof basicProps>>> & HTMLAttributes

export default defineComponent({
  name: 'CPage',
  props: basicProps(),
  setup(props, { slots }) {
    const isVertical = computed(() => {
      if (props.vertical === undefined || props.vertical) {
        return true
      }
      // see： https://github.com/element-plus/element-plus/blob/dev/packages/components/container/src/container.vue
      if (slots && slots.default) {
        const vNodes: VNode[] = slots.default()
        return vNodes.some((vNode) => {
          const tag = (vNode.type as Component).name
          return tag === 'CHeader' || tag === 'CFooter'
        })
      }
      return false
    })

    return () => (
      <ElContainer
        class="page"
        direction={isVertical.value ? 'vertical' : 'horizontal'}
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
      </ElContainer>
    )
  }
})
