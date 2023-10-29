<template>
  <el-button @click="handleNavigate" >路由跳转</el-button>
  <el-input />
  <el-table>
    <el-table-column label="名称" prop="name"></el-table-column>
  </el-table>
  <Table></Table>
  <ChildComponent />
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import useApp from './useApp'
  import ChildComponent from './ChildComponent.vue';

  const router = useRouter()
import { onMounted } from 'vue';

  const data = useApp()


  const handleNavigate = () => {
    router.push('/map/openlayers')
  }

  onMounted(() => {
    console.log(data);
  })
</script>