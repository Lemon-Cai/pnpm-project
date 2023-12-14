<!--
 * @Author: CP
 * @Date: 2023-11-29 15:02:56
 * @Description: 
-->
<template>
  <div class="task-list">
    <div class="task-item">
      <i class="iconfont icon-file-folder"></i>
      <span>{{ title }}</span>
      <el-progress :percentage="progress" />
      <div v-if="status === 'ok'">上传完成</div>

      <span>{{ percentage }}</span>
    </div>
  </div>
</template>
<script>
import { ref, watch, defineComponent } from 'vue'
export default defineComponent({
  name: 'customProgress',
  props: {
    percentage: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    }
  }, // 接收父组件传递的prop
  emits: ['finish'], // 接收父组件传递的事件
  setup(props, { emit }) {
    let progress = ref(props.percentage)
    let status = ref('')

    watch(progress, (newVal) => {
      if (newVal >= 100) {
        status.value = 'ok'
        emit('finish', status.value) // 发射事件，并传递一个参数
      }
    })
    return {
      progress, status
    }
  }
})
</script>
<style scoped>
.task-item {
  width: 290px;
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-template-rows: 2fr 1fr 2fr;
  align-items: center;
}
.task-item i {
  font-size: 30px;
  color: rgb(252, 203, 66);
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 4;
}
</style>
