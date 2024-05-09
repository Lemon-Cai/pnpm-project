<template>
  <!-- 移除 :where选择器 -->
  <a-style-provider hash-priority="high">
    <router-view></router-view>
  </a-style-provider>
</template>

<script setup lang="ts">
import {onMounted} from 'vue'

onMounted(() => {})
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
