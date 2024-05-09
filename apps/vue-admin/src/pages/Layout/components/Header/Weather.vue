<!--
 * @Author: CP
 * @Date: 2024-03-02 12:54:22
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div class="weather_box flex flex-middle">
    <div class="weather_icon">
      <img  src="~@/assets/images/layout/weather.png" alt="" @click="handleLogout"/>
    </div>
    <div class="flex-1">
      <p class="desc">晴转多云</p>
      <p class="temperature">18~26℃</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted } from 'vue';
/**
* 数据部分
*/
const formRef = ref()
const data = reactive({})
onMounted(() => {
})
defineExpose({
  ...toRefs(data)
})

</script>
<style scoped lang='scss'>
.weather_box {
  gap: 8px;
  overflow: hidden;
  .weather_icon {
    img {
      vertical-align: middle;
      width: 32px;
    }
  }
  .flex-1 {
    overflow: hidden;
  }
  p {
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>