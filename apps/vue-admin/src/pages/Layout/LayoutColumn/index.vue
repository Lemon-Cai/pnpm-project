<template>
  <!-- 经典布局 -->
  <ZPage class="column_page_container" direction="vertical">
    <Header class="top_wrapper flex" />
    <ZPage>
      <!-- 侧边菜单 -->
      <Menu />
      <!-- 主体 -->
      <ZPage class="main_body">
        <ZHeader class="tab_wrapper">
          <!-- tab list -->
          <Tabs />
          <!-- 更多操作 -->
          <!-- <div class="tab__more"></div> -->
        </ZHeader>

        <!-- 主页面 -->
        <ZContent id="main" class="main_wrapper">
          <router-view v-slot="{ Component }">
            <keep-alive :include="aliveView">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </ZContent>
      </ZPage>
    </ZPage>
  </ZPage>
</template>

<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
} from 'vue';
// import { useRoute, useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';
import { useStore } from 'vuex';

import admin from '@/util/admin';
import { getToken } from '@/util/auth';
import { calcDate } from '@/util/date';
import { validatenull } from '@/util/validate';

import Menu from '@/page/Layout/components/Menu/index.vue';
import Header from './components/Header.vue';
import Tabs from './components/Tabs.vue';

const { proxy } = getCurrentInstance()

const store = useStore();

const timer = ref(0);
const refreshLock = ref(false);
const aliveView = reactive(['KeepAliveView']);

// 创建立即执行设置值
store.commit('SET_SCREEN', admin.getScreen());

// 监听窗口变化
const listeningWindow = useDebounceFn(() => {
  // screenWidth.value = document.body.clientWidth
  // if (!isCollapse.value && screenWidth.value < 1200) store.commit('SET_COLLAPSE', true)
  // if (isCollapse.value && screenWidth.value > 1200) store.commit('SET_COLLAPSE', false)
  store.commit('SET_SCREEN', admin.getScreen());
}, 100);

// 定时刷新token
const refreshToken = () => {
  timer.value = setInterval(() => {
    const token = getToken() || {};
    const date = calcDate(token.datetime, new Date().getTime());
    if (validatenull(date)) return;
    if (date.seconds >= proxy.website.tokenTime && !refreshLock.value) {
      refreshLock.value = true;
      store
        .dispatch('refreshToken')
        .then(() => {
          refreshLock.value = false;
        })
        .catch(() => {
          refreshLock.value = false;
        });
    }
  }, 10*60*1e3);
};

onMounted(() => {
  refreshToken();
  window.addEventListener('resize', listeningWindow, false);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', listeningWindow);
  clearInterval(timer.value);
});
</script>

<style lang="scss" scoped>
</style>
