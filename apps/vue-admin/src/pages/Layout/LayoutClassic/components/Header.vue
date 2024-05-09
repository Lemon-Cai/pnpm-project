<!--
 * @Author: CP
 * @Date: 2024-01-18 17:34:50
 * @LastEditors: Please set LastEditors
 * @Description:  经典布局
-->

<template>
  <z-header class="top_wrapper flex">
    <!-- <img class="header_bg" src="~@/assets/images/layout/header_bg.png" /> -->
    <!-- logo -->
    <Logo />

    <!-- 一级菜单 -->
    <div class="flex-1 menu_wrapper">
      <Menu class="flex-around" :menu-list="menuList" @onMenuClick="handleMenuClick" />
    </div>
    <!-- toolbar -->
    <ToolBar />
  </z-header>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

import Logo from '@/page/Layout/components/Header/Logo.vue'
import Menu from '@/page/Layout/components/Header/Menu.vue'
import ToolBar from '@/page/Layout/components/Header/ToolBar.vue'

const store = useStore()

const menuList = computed(() => store.getters.topMenuList)

// top菜单点击事件
const handleMenuClick = menu => {
  // emit('onTopMenuClick', menu)
}
</script>

<style lang="scss" scoped></style>
