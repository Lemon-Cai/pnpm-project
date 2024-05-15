<!--
 * @Author: CP
 * @Date: 2024-05-13 14:43:58
 * @Description: 
-->
<template>
  <div class="flex">
    <OfficialExample class="flex-1" />

    <div class="flex-1">
      <a-input-search
        v-model:value="searchValue"
        placeholder="Search"
        style="margin-bottom: 8px; width: 350px"
      />
      <a-tree
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        :load-data="onLoadData"
        :tree-data="treeData"
        :height="500"
        checkable
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted, toRaw } from 'vue'
import type { TreeProps } from 'ant-design-vue'

// import { findParentMenuByKey } from '@/utils'

import OfficialExample from './OfficialExample.vue'

const searchValue = ref<string>('')
const expandedKeys = ref<(string | number)[]>([])
const selectedKeys = ref<string[]>([])

const treeData = ref<TreeProps['treeData']>([])
const cacheTreeData = ref<TreeProps['treeData']>([])

const onLoadData: TreeProps['loadData'] = (treeNode) => {
  return new Promise<void>((resolve) => {
    if (treeNode.dataRef?.children) {
      resolve()
      return
    }
    setTimeout(() => {
      treeNode.dataRef.children = [
        { title: 'Child Node', key: `${treeNode.eventKey}-0` },
        { title: 'Child Node', key: `${treeNode.eventKey}-1` }
      ]
      treeData.value = [...treeData.value]
      resolve()
    }, 200)
  })
}

const getParentKey = (
  key: string | number,
  tree: TreeProps['treeData'] = []
): string | number | undefined => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

// const expandedKeys = ref<(string | number)[]>([]);
const autoExpandParent = ref<boolean>(true)

watch(searchValue, (value) => {
  // console.log(
  //   '======',
  //   toRaw(cacheTreeData.value)
  //     .map((item: TreeProps['treeData'][number]) => {
  //       if (item.title.indexOf(value) > -1) {
  //         return findParentMenuByKey(treeData.value, item.key as string)
  //       }
  //       return null
  //     })
  //     .filter(Boolean)
  // )
  const expanded = toRaw(cacheTreeData.value)
    .map((item: TreeProps['treeData'][number]) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, treeData.value)
      }
      return null
    })
    .filter(Boolean)
  // .filter((item, i, self) => item && self.indexOf(item) === i)
  expandedKeys.value = expanded
  searchValue.value = value
  autoExpandParent.value = true
})

// function filterNodeMethod (searchValue, node) {
//   if (!searchValue) return true
//   return (node.name || '').includes(searchValue)  
// }

// function filter(value) {
  
//     const lazy = this.lazy;
//     const traverse = function(node) {
//       const childNodes = node.root ? node.root.childNodes : node.childNodes;
//       childNodes.forEach((child) => {
//         child.visible = filterNodeMethod.call(child, value, child.data, child);
//         traverse(child);
//       });
//       if (!node.visible && childNodes.length) {
//         let allHidden = true;
//         allHidden = !childNodes.some((child) => child.visible);
//         if (node.root) {
//           ;
//           node.root.visible = allHidden === false;
//         } else {
//           ;
//           node.visible = allHidden === false;
//         }
//       }
//       if (!value)
//         return;
//       if (node.visible && !node.isLeaf) {
//         if (!lazy || node.loaded) {
//           ;
//           node.expand();
//         }
//       }
//     };
//     traverse(this);
//   }

const flatTree = (treeList = []) => {
  let dataList = []
  const generateList = (data: TreeProps['treeData']) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const key = node.key
      dataList.push({ key, title: node.title })
      if (node.children) {
        generateList(node.children)
      }
    }
  }
  generateList(treeList)

  return dataList
}

onMounted(() => {
  fetch('/mock/getTree', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response && response.json())
    .then((response) => {
      console.log(response)
      if (response.success) {
        cacheTreeData.value = flatTree(response.data)
        treeData.value = response.data
      }
    })
})
</script>
