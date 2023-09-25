<template>
  <el-button>按钮</el-button>
  <el-input />
  <el-table>
    <el-table-column label="名称" prop="name"></el-table-column>
  </el-table>
  <Table></Table>
  <ChildComponent />
</template>

<script setup lang="ts">
  import useApp from './useApp'
  import ChildComponent from './ChildComponent.vue';

  const data = useApp()
</script>