<template>
  <!-- 经典布局 -->
  <ZPage class="classic_page_container" direction="vertical">
    <Header v-if="!isFullscreen" />
    <ZPage>
      <!-- 侧边菜单 -->
      <Menu v-if="!isFullscreen" />
      <!-- 主体 -->
      <ZPage
        class="main_body"
        :class="{
          fullScreen: isFullscreen
        }"
      >
        <ZHeader class="tab_wrapper" v-if="!isFullscreen">
          <!-- tab list -->
          <Tabs />
        </ZHeader>

        <!-- 主页面 -->
        <ZContent id="main" class="main_wrapper">
          <router-view v-slot="{ Component, route }">
            <keep-alive>
              <component :is="Component" :key="route.name" v-if="route.meta.keepAlive" />
            </keep-alive>
            <component :is="Component" v-if="!route.meta.keepAlive" />
          </router-view>
        </ZContent>
      </ZPage>
    </ZPage>
  </ZPage>
</template>

<script setup>
import { ref, /* reactive, getCurrentInstance, */ onBeforeUnmount, onMounted, onUnmounted } from 'vue'
// import { useRoute, useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core'
import { useStore } from 'vuex'

import admin from '@/util/admin'
// import { getToken } from '@/util/auth'
// import { calcDate } from '@/util/date'
// import { validatenull } from '@/util/validate'
import { FULL_SCREEN_EVENT } from '@/config/constrant'
import Menu from '../components/Menu/index.vue'
import Header from './components/Header.vue'
import Tabs from './components/Tabs.vue'
import { useFullscreen } from '@vueuse/core'
import emitter from '@/utils/eventBus'

// const { proxy } = getCurrentInstance()

const store = useStore()

const { toggle, isFullscreen } = useFullscreen(document.body)

const timer = ref(0)
// const aliveView = reactive(store.getters.keepAliveMenus)

const handleFullScreen = () => {
  toggle()
}

// 创建立即执行设置值
store.commit('SET_SCREEN', admin.getScreen())

// 监听窗口变化
const listeningWindow = useDebounceFn(() => {
  // screenWidth.value = document.body.clientWidth
  // if (!isCollapse.value && screenWidth.value < 1200) store.commit('SET_COLLAPSE', true)
  // if (isCollapse.value && screenWidth.value > 1200) store.commit('SET_COLLAPSE', false)
  store.commit('SET_SCREEN', admin.getScreen())
}, 100)

// // 定时刷新token
// const refreshToken = () => {
//   timer.value = setInterval(() => {
//     const token = getToken() || {}
//     const date = calcDate(token.datetime, new Date().getTime())
//     if (validatenull(date)) return
//     if (date.seconds >= proxy.website.tokenTime && !refreshLock.value) {
//       refreshLock.value = true
//       store
//         .dispatch('refreshToken')
//         .then(() => {
//           refreshLock.value = false
//         })
//         .catch(() => {
//           refreshLock.value = false
//         })
//     }
//   }, 1 * 60 * 1e3)
// }

// onErrorCaptured((err, vm, info) => {
//   console.log('onErrorCaptured', err, vm, info)
// })

onMounted(() => {
  emitter.on(FULL_SCREEN_EVENT, handleFullScreen)

  // refreshToken()
  window.addEventListener('resize', listeningWindow, false)
})

onUnmounted(() => {
  emitter.off(FULL_SCREEN_EVENT, handleFullScreen)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', listeningWindow)
  clearInterval(timer.value)
})
</script>

<style lang="scss" scoped></style>
