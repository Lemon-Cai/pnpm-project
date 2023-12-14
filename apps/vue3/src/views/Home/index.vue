<!--
 * @Author: CP
 * @Date: 2023-11-03 09:47:33
 * @Description: 
-->
<template>
  <ChildComponent :beforeChange="handleBeforeChange" />
  <c-page class="custom_page">
    <c-header class="custom_page_header">这是header</c-header>
    <c-content class="custom_page_content">
      <p>这是content</p>
      <el-space>
        <el-button @click="handleNavigate">路由跳转</el-button>
        <el-input />
      </el-space>
      <el-table>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="年龄" prop="age"></el-table-column>
        <el-table-column label="类型" prop="type"></el-table-column>
      </el-table>
      <c-page>
        <c-content>
          <p>这是子布局</p>
          <Table
            :columns="[
              {
                label: '单位'
              }
            ]"
          ></Table>
        </c-content>
      </c-page>
    </c-content>
    <c-footer class="custom_page_footer">这是footer</c-footer>
  </c-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useApp from './useApp'
import ChildComponent from './ChildComponent.vue'

const router = useRouter()

const data = useApp()

const handleBeforeChange = (val: any) => {
  console.log(val)
  return 'aa'
}

const handleNavigate = () => {
  router.push('/map/openlayers')
}

onMounted(() => {
  console.log(data)
})
</script>
