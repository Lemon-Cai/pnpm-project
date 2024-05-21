/*
 * @Author: CP
 * @Date: 2024-05-21 14:41:29
 * @Description: 
 */
import { defineComponent, type SlotsType } from "vue";
import { Space, type SpaceProps } from 'ant-design-vue';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: "CSpace",
  // props: SpaceProps,
  slots: Object as SlotsType<{
    split?: any;
    default?: any;
  }>,
  setup(props: Readonly<SpaceProps>, { slots }) {
    return () => (
      <Space {...props}>
        {{
          default: () => slots.default ? slots.default() : null,
          split: () => slots.split ? slots.split() : null,
        }}
      </Space>
    );
  }
});

