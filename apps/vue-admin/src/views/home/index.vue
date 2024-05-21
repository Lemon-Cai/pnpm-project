<!--
 * @Author: CP
 * @Date: 2024-01-08 20:35:06
 * @Description: 
-->
<template>
  <c-page>
    <c-header class="main_header">
      <c-space :size="20">
        <router-link v-for="item in routeList" :key="item.label" :to="item.to">{{ item.label }}</router-link>
      </c-space>
    </c-header>
    <c-content class="main_content"></c-content>
  </c-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const routeList = computed(() => {
  let routes = router.getRoutes()
  return routes.map(item => ({
    to: item.path,
    label: item.name || item.path
  }))
})

onMounted(() => {
})

</script>
<style scoped lang='scss'>
</style>