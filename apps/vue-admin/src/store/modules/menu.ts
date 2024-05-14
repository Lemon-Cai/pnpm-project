import { defineStore } from "pinia";


export const useGlobalStore = defineStore('menu-store', {
  state: () => ({ 
    menus: []
  }),
  getters: {
  },
  actions: {
    increment() {
    },
  },
})