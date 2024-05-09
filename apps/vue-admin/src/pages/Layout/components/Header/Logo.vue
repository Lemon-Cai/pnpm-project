<!--
 * @Author: CP
 * @Date: 2024-01-18 17:13:44
 * @LastEditors: wenYuan 1063363934@qq.com
 * @Description:
-->
<template>
  <div class="logo flex flex-middle">
    <div class="logo_img" :class="{ no_text: !state.title }">
      <div v-if="store.getters.showLogo" class="top_logo" >
        <img src="@/assets/images/layout/logo.bk.png" class="logo_pic" alt="">
        <div class="logo_text">{{ state.title}}</div>
      </div>
      <!-- <img v-if="store.getters.showLogo" :src="state.logo" alt="logo" /> -->
      <div v-else  class="logo_text2"
        >{{ website.title2 }}</div
      >
    </div>
    <!-- 目前logo 和文字 结合生成一个图片-->
    <!-- <span v-if="state.title" class="logo_text">{{ state.title }}</span> -->
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { DEFAULT_APP_TITLE } from '@/config/constant'
import LogoImg from '@/assets/images/layout/logo.png'
import { useStore } from 'vuex'
import useAppStore from '@/store/hooks/useAppStore'
import website from '@/config/website'
const { globalConfig } = useAppStore(['globalConfig'])
const store = useStore()
const state = reactive({
  logo: LogoImg,
  title: globalConfig.value.globleTitle
})
</script>

<style lang="scss" scoped>

</style>
