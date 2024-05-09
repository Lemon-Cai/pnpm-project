import { defineStore } from "pinia";
import type { GlobalState } from '@/store/interface'


export const useGlobalStore = defineStore('global-store', {
  state: (): GlobalState => ({ 
    layout: import.meta.env.VUE_APP_LAYOUT || 'classic', // 重点： 布局方式
  }),
  getters: {
  },
  actions: {
    increment() {
    },
  },
})