<!--
 * @Author: CP
 * @Date: 2023-11-03 09:47:33
 * @Description: 
-->
<template>
  <div>
    ChildComponent，
    测试在 hooks中使用provide ，在子组件中能否inject 获取到
    <p v-for="item in data" :key="item">{{  item  }}</p>
  </div>
</template>

<script setup lang="ts">
import { /* ref, reactive, toRefs, */ onMounted, inject } from 'vue';

const props = defineProps({
  beforeChange: null
})

/**
* 数据部分
*/
const data = inject('data')
console.log('========================', data);
onMounted(() => {
  const result = props.beforeChange?.('sssss')
  console.log('result: ', result);
})
defineExpose({
})

</script>

<style scoped lang='scss'>
</style>