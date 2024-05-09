<!--
 * @Author: CP
 * @Date: 2024-01-18 17:34:50
 * @LastEditors: Please set LastEditors
 * @Description: 分栏布局
-->

<template>
  <z-header>
    <!-- 一级菜单 -->
    <Menu class="menu_box__left" :menu-list="state.leftNav" @onMenuClick="handleMenuClick" />
    <div class="top_center"></div>
    <Menu class="menu_box__right" :menu-list="state.rightNav" @onMenuClick="handleMenuClick" />
  </z-header>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, reactive, watchEffect } from 'vue';

import Menu from '@/page/Layout/components/Header/Menu.vue';

const store = useStore();

const menuList = computed(() => store.getters.topMenuList);

const state = reactive({
  leftNav: [], // 左侧一级菜单
  rightNav: [] // 右侧一级菜单
});

// top菜单点击事件
const handleMenuClick = menu => {
  // emit('onTopMenuClick', menu)
};

watchEffect(() => {
  let len = menuList.value.length
  const half = Math.ceil(len / 2);
  state.leftNav = menuList.value.slice(0, half);
  state.rightNav = menuList.value.slice(half, len);
});
</script>

<style lang="scss" scoped></style>
