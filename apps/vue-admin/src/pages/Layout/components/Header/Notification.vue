<!--
 * @Author: CP
 * @Date: 2024-03-02 12:56:04
 * @LastEditors: zhangwenqiang
 * @Description:
-->
<template>
  <div class="notification_box">
    <el-badge>
      <img src="~@/assets/images/layout/notification.png" alt="" @click="viewSinglelineInfo" />
    </el-badge>
    <div v-if="pagination.total > 0" class="info-num">{{ pagination.total }}</div>
    <el-dialog v-model="dialogVisible" title="待办事项" :footer="false" width="60%">
      <core-layout :background="true">
        <template #bottom>
          <CoreTable ref="crudRef" :data="result" :coloum="column" :pagination="pagination">
            <template #workStatus="{ scope }">
              <span v-if="scope.row.status == '2' && scope.row.workStatus == '0'">待复飞</span>
              <span v-else-if="scope.row.status == '3' && scope.row.verifiedStatus == '1'">待验证</span>
            </template>
          </CoreTable>
        </template>
      </core-layout>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { pageTodo } from '@/api/singleLineDemo/index'
import { useQueryList } from '@/hooks'
/**
 * 数据部分
 */
const formRef = ref()
const data = reactive({})
const dialogVisible = ref(false)

const column = [
  // {
  //   prop: 'lineName',
  //   label: '线路名称'
  // },
  // {
  //   prop: 'deviceName',
  //   label: '杆塔名称'
  // },
  {
    prop: 'content',
    label: '待办信息'
  },
  {
    prop: 'completionStatus',
    label: '状态'
  }
]

const { setQuery, pageLoading, pagination, reset, result, refresh } = useQueryList(
  {
    current: 1,
    size: 10
  },
  pageTodo
)

const viewSinglelineInfo = () => {
  setQuery({
    current: 1,
    size: 10
  })
  if (pagination.value.total > 0) {
    dialogVisible.value = true
  }
}

onMounted(() => {})
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss">
.notification_box {
  position: relative;
  img {
    vertical-align: middle;
  }
  .info-num {
    position: absolute;
    bottom: -8px;
    right: -10px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    text-align: center;
    border-radius: 50%;
    background-color: #ff0000;
    transform: scale(0.7);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
