<!--
 * @Author: CP
 * @Date: 2024-02-01 10:17:44
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div class="toolbar_box">
    <!-- 时间 -->
    <Time />
    <!-- 分割线 -->
    <ElDivider direction="vertical"/>
    <!-- 天气 -->
    <Weather />
    <!-- 消息 -->
    <Notification />
    <!-- userInfo -->
    <UserInfo />
    <!-- logout -->
    <Logout />
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, defineExpose } from 'vue'
import UserInfo from './UserInfo.vue'
import Logout from './Logout.vue'
import Time from './Time.vue'
import Weather from './Weather.vue'
import Notification from './Notification.vue'
import { ElDivider } from 'element-plus'
/**
 * 数据部分
 */
const data = reactive({})
onMounted(() => {})
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss"></style>
