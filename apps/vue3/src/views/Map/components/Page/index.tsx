/*
 * @Author: CP
 * @Date: 2023-11-09 13:36:22
 * @Description: 
 */
import { defineComponent, /* renderSlot */ } from "vue";

import type { SetupContext } from "vue";

export default defineComponent({
  setup(props: Readonly<any>, { slots }: SetupContext) {

    return () => (
      <div class="page" style="width: 100%; height: 100%;">
        { slots.default ? slots.default() : undefined }
        {/* <main>
          {
            renderSlot(slots, 'body')
          }
        </main> */}
      </div>
    )
  }
})