<!--
 * @Author: CP
 * @Date: 2024-01-19 10:48:08
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <z-aside v-if="showCollapse" class="aside_menu_wrapper" :width="isCollapse ? '220px': '60px'">
    <!-- 收缩/展开 按钮 -->
    <div class="collapse_box">
      <el-icon @click="handleToggleCollapse">
        <Fold v-if="isCollapse" /> 
        <Expand v-else />
      </el-icon>
    </div>
    <el-scrollbar height="100%">
      <el-menu
        :router="false"
        :default-active="activeMenu"
        :collapse="!isCollapse"
        unique-opened
        :collapse-transition="false"
      >
        <SubMenu :menu-list="appMenuList" @onMenuClick="handleMenuClick" />
      </el-menu>
    </el-scrollbar>
  </z-aside>
</template>

<script setup>
import { watchEffect, computed } from 'vue';
// import { useDebounceFn } from '@vueuse/core'
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import SubMenu from './SubMenu.vue';

const route = useRoute();
const store = useStore();

const isCollapse = computed(() => store.getters.screen > 1 ? store.getters.isCollapse : false);
const showCollapse = computed(() => store.getters.showCollapse);
const activeMenu = computed(() => store.getters.activeMenu);
const appMenuList = computed(() => store.getters.appMenuList);
const flattenMenuList = computed(() => store.getters.flattenMenuList || []);
// 监听窗口大小变化，折叠侧边栏
// const screenWidth = ref(0)

// 点击菜单
const handleMenuClick = ({ key, meta }) => {
  console.log('==========>', key, meta);
  // if (meta.isLink) return window.open(meta.isLink, '_blank')

  // if (key !== undefined) {
  //   // selectedKeys.value = [key]
  //   // activeMenu.value = key + ''
  //   updateActiveMenu(key + '')
  //   const res = flattenMenuList.find((item) => item.key === key)
  //   if (res) {
  //     router.push(res.path!)
  //   }
  // }
};

// 点击收缩侧边栏
const handleToggleCollapse = () => {
  store.commit('SET_COLLAPSE', !isCollapse.value)
};

function initKeys() {
  const { fullPath } = route;
  const res = flattenMenuList.value.find(item => item.path === fullPath);
  if (res) {
    // selectedKeys.value = [res.key]
    // updateActiveMenu(res.path)
    store.commit('UPDATE_ACTIVE_MENU', res.path);
  }
}

watchEffect(initKeys);

// // 监听窗口变化
// const listeningWindow = useDebounceFn(() => {
//   screenWidth.value = document.body.clientWidth
//   if (!isCollapse.value && screenWidth.value < 1200) store.commit('SET_COLLAPSE', true)
//   if (isCollapse.value && screenWidth.value > 1200) store.commit('SET_COLLAPSE', false)
// }, 100)

// window.addEventListener('resize', listeningWindow, false)
// onBeforeUnmount(() => {
//   window.removeEventListener('resize', listeningWindow)
// })
</script>

<style lang="scss" scoped></style>
