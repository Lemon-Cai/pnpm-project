/*
 * @Author: CP
 * @Date: 2024-06-05 10:42:07
 * @Description: 
 */
import { computed, defineComponent } from "vue";
import { nanoid } from 'nanoid'
// import { MapProps } from './props'
import Style from './map.module.scss'

export default defineComponent({
  name: "CMap",
  // props: MapProps,
  setup(props, { slots }) {

    const vid = computed(() => {
      return props?.container || nanoid()
    })

    return () => (
      <div class={Style.container} id={vid.value}>
        {{
          default: () => slots.default ? slots.default() : null
        }}
      </div>
    )
  }
})