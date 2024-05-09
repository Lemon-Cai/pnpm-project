<!--
 * @Author: CP
 * @Date: 2024-02-22 17:07:26
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <component :is="LayoutComponents[layout]" />
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { storeToRefs } from 'pinia'
// import { useStore } from 'vuex'
import { useGlobalStore } from '@/store/modules/global.ts'
import type { LayoutType } from "@/store/interface";

import LayoutClassic from './LayoutClassic/index.vue'
import LayoutColumns from './LayoutColumn/index.vue'

const globalStore = useGlobalStore()

const { layout }  = storeToRefs(globalStore)

const LayoutComponents: Record<LayoutType, Component> = {
  classic: LayoutClassic,
  columns: LayoutColumns
}

// TODO: 修改成可切换布局
// const layout = computed(() => globalStore.layout);

// const layout = computed(() => store.getters.layout)

</script>

<style lang="scss" scoped></style>
