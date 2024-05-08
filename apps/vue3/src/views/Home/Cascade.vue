<!--
 * @Author: CP
 * @Date: 2024-05-06 16:11:33
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div class="m-4">
    <p>Filterable (Multiple selection)</p>
    <el-cascader
      ref="cascadeRef"
      placeholder="Try searchingL Guide"
      :props="props"
      filterable
      :filter-method="handleFilter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'

const cascadeRef = ref()
const checkStrictly = ref(true)
const isChangeProps = ref(false)


const handleLoad = (node, resolve) => {
    // if (isChangeProps.value) {
    //   console.log(cascadeRef.value)
    //   return
    // }
    const { level } = node
    setTimeout(() => {
      const nodes = Array.from({ length: level + 1 }).map((item) => ({
        value: ++id,
        label: `Option - ${id}`,
        leaf: level >= 2
      }))
      if (level > 0) {
        checkStrictly.value = false
        isChangeProps.value = true
      }
      // Invoke `resolve` callback to return the child nodes data and indicate the loading is finished.
      resolve(nodes)
    }, 500)
  }
  
let id = 0

const props = {
  multiple: true,
  checkStrictly: checkStrictly,
  emitPath: false,
  lazy: true,
  lazyLoad: handleLoad
}

const handleFilter = (node, key) => {
  console.log(node, key)
  return (node.data?.label || '').includes(key)
}
</script>
<style scoped lang="scss"></style>
