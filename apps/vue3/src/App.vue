

<template>
  <!-- <el-button type="primary">按钮</el-button> -->
  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { reactive } from 'vue';

let state = reactive([1, 2, 4])

const handleChange = () => {
  // state.length = 0
  // Array.from([3, 4, 5], (item) => state.push(item)) // √
  // state.push(...[6, 7, 89]) // √

  // state = reactive([9, 8, 12, 33]) // X

}
</script>


<style scoped>
</style>
