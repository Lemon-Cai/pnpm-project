<!--
 * @Author: CP
 * @Date: 2023-11-03 09:47:33
 * @Description: 
-->
<template>
  <c-page class="custom_page">
    <c-header class="custom_page_header">
      <el-space>
        <router-link v-for="item in routeList" :key="item.label" :to="item.to">{{ item.label }}</router-link>
      </el-space>
    </c-header>
    <c-content class="custom_page_content">
      <h2>这是content</h2>
      <ChildComponent :beforeChange="handleBeforeChange" />

      <br />

      <h2>表格</h2>
      <el-table>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="年龄" prop="age"></el-table-column>
        <el-table-column label="类型" prop="type"></el-table-column>
      </el-table>
      <c-page>
        <c-content>
          <h2>这是子布局</h2>
          <h3>表格组件</h3>
          <Table
            :columns="[
              {
                label: '单位'
              }
            ]"
          ></Table>

          <h3>地图</h3>
          <Map @click="handleClickMap">
            <template #leftIcon>
              <el-button>这个按钮</el-button>
            </template>
          </Map>

          <br />
          <h3>级联</h3>

          <Cascade />
        </c-content>
      </c-page>
    </c-content>
    <c-footer class="custom_page_footer">这是footer</c-footer>
  </c-page>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import useApp from './useApp'
import ChildComponent from './ChildComponent.vue'
import Cascade from './Cascade.vue'

import Map from '../Map/index'

const handleClickMap = () => {
  console.log('handleClickMap')
}

const router = useRouter()

const data = useApp()

const routeList = computed(() => {
  let routes = router.getRoutes()
  return routes.map(item => ({
    to: item.path,
    label: item.name || item.path
  }))
})

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
