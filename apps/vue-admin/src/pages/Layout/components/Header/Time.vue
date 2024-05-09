<!--
 * @Author: CP
 * @Date: 2024-03-02 12:53:23
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div class="time_box">
    <p class="time">{{ state.time }}</p>
    <p class="date">{{ state.date }}</p>
  </div>
</template>

<script setup>
import { reactive, onUnmounted } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'
/**
 * 数据部分
 */
const state = reactive({
  time: '', // 时间
  date: '' // 日期
})

const { pause } = useIntervalFn(() => {
  let [date, time] = dayjs().format('YYYY年MM月DD日 HH:mm:ss').split(' ')
  state.time = time
  state.date = date
}, 1000)

onUnmounted(() => {
  pause()
})
</script>
<style scoped lang="scss">
  .time_box {
    .time {
      text-align: right;
    }
    p {
      margin: 0;
    }
  }
</style>
