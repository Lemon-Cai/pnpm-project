<!--
 * @Author: CP
 * @Date: 2024-03-06 14:32:15
 * @LastEditors: Please set LastEditors
 * @Description:
-->
<template>
  <div class="left flex flex-vertical">
    <el-input v-model="filterText" placeholder="请输入查询条件"></el-input>

    <div ref="treeBoxRef" class="tree_wrapper flex-1">
      <el-tree-v2
        v-if="state.onMounted"
        ref="treeRef"
        node-key="guid"
        :data="treeData"
        :props="{
          value: 'guid',
          label: 'name',
          children: 'children',
          isLeaf: 'isLeaf'
        }"
        show-checkbox
        :height="state.visualHeight"
        :filter-method="handleFilterNode"
        :default-expanded-keys="state.defaultExpandedKeys"
        :default-checked-keys="state.defaultCheckedKeys"
        @node-click="handleClickNode"
        @check-change="handleCheck"
      >
        <template #default="{ data }">
          <div class="node_item" :title="data.name">
            {{ data.name }}
          </div>
          <span v-if="data.nextNodeNum > 0">（{{ data.nextNodeNum }}）</span>
        </template>
      </el-tree-v2>
    </div>

    <div class="btn_operate_box">
      <el-button type="primary" :disabled="!state.canAdd" @click="handleAddTreeNode"
        >添加</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, toRaw, toRef, nextTick } from 'vue'
import PQueue from 'p-queue'
import { useDebounceFn } from '@vueuse/core'

import {
  fetchDeviceTree,
  fetchDeviceTreeOfChildren,
  fetchAirportAndRouteList
} from '@/api/SearchTree'

const queue = new PQueue({ concurrency: 50 }) // 创建一个队列

/**
 * 数据部分
 */

const props = defineProps({
  // 作业对象， 变电 sms 单独处理， 变电数据量 < 1000
  professionalCategory: {
    type: String,
    default: ''
  },
  isAutonomous: {
    type: Boolean
  },
  orderGuid: {
    type: String
  },
  selectedData: {
    type: Array,
    default: () => []
  },
  workNatureList: {
    type: Array,
    default: () => []
  },
  workNature: {
    type: String
  },
  // 巡检方式
  inspectionType: {
    type: String
  },
  airportGuid: {
    type: String
  }
})

const treeRef = ref()
const treeBoxRef = ref()

// 过滤输入
const filterText = ref()

const treeData = ref([])

const state = reactive({
  loading: true,
  workNature: props.workNature || '',
  originTreeData: [],
  smsRouteList: [], // 变电航线集合

  visualHeight: 200, // 虚拟滚动高度, 默认 200
  defaultExpandedKeys: [], // 默认展开节点
  defaultCheckedKeys: [], // 默认选择的tree node

  cacheLazyArr: [], // 缓存

  // cacheTableData: [], // 筛选时缓存
  tableData: props.selectedData || [],
  selectRows: [],
  canAdd: false
})

const debouncedFn = useDebounceFn(async (val) => {
  treeRef.value && treeRef.value.filter(val)
}, 500)

watch(filterText, debouncedFn)

// 过滤
const handleFilterNode = (value, data) => {
  if (!value) return true

  if (data.deviceType === 'sms') {
    // 变电，只能搜索变电站层级， 其他返回false
    if (['station', 'substation'].includes(data.nodeType.split('_')[1])) {
      return (data.name || '').includes(value)
    } else {
      return false
    }
  } else {
    if (['line'].includes(data.nodeType.split('_')[1])) {
      // 该节点是线路
      if (!data.loaded) {
        // 如果未加载， 只能筛选 线路
        return (data.name || '').includes(value)
      }
    }
    if (['tower'].includes(data.nodeType.split('_')[0])) {
      // 杆塔
      return (data.name || '').includes(value)
    }
    return false
  }
}

const _getChildNode = async (node, flag = true) => {
  if (!node.loaded) {
    // 未加载 且 判断 是否存在子集
    try {
      // 数据加载过程中，禁止点击添加按钮
      state.canAdd = false
      let params = {
        lineGuid: node.guid,
        isAutonomous: props.isAutonomous || '1',
        isAirport: '0'
      }
      if (props.inspectionType === '1') {
        // 固定机场
        params = { ...params, isAirport: '1', airportGuid: props.airportGuid } // , airspaceGuid: ''
      }
      let res = await fetchDeviceTreeOfChildren(params)
      if (res.success) {
        let results = res.data || []

        node.children = results
        node.loaded = true // 变更当前节点加载状态
        flag && state.cacheCheckedNode.push(node) // 是否需要勾选子集
        nextTick(() => {
          // 获取该节点
          let updatedNode = treeRef.value.getNode(node)
          // 展开
          treeRef.value.expandNode(updatedNode)
        })
      }
    } catch (e) {
      // state.canAdd = true
    }
  }
}

function _getChildNodeGuid(list = []) {
  for (const item of list) {
    if (item.deviceType !== 'sms') {
      // 非变电
      if (['line'].includes(item.nodeType.split('_')[1])) {
        // 到线路层级。
        // 判断
        if (!item.loaded) {
          // 未加载数据
          if (!state.loading) state.loading = true
          queue.add(() => _getChildNode(item))
        }
      }
    }
    item.children?.length > 0 && _getChildNodeGuid(item.children)
  }
}

const handleCheck = (node, checked) => {
  if (checked) {
    if (node.children?.length > 0) {
      _getChildNodeGuid(node.children)
    } else {
      if (node.deviceType !== 'sms') {
        // 非变电
        if (['line'].includes(node.nodeType.split('_')[1])) {
          // 到线路层级。
          // 判断
          if (!node.loaded) {
            // 未加载数据
            if (!state.loading) state.loading = true
            queue.add(() => _getChildNode(node))
          }
        }
      }
    }

    // 数据请求完成后
    state.loading &&
      queue.onIdle().then(() => {
        state.canAdd = true
        state.loading = false

        // 刷新数据
        treeRef.value.setData(unref(treeData.value))
        // 刷新勾选
        // 数据加载完后，展开节点
        nextTick(() => {
          if (state.cacheCheckedNode.length > 0) {
            state.cacheCheckedNode.forEach((node) => {
              // 勾选
              treeRef.value.setChecked(node.guid, true, true)
            })
            // 清空
            state.cacheCheckedNode = []
          }
        })
      })
  } else {
    // treeRef.value.setCheckedKeys(checkedKeys)
  }
}

// 点击节点
const handleClickNode = (data) => {
  let flag = false
  if (data.deviceType !== 'sms') {
    // 非变电
    if (['line'].includes(data.nodeType.split('_')[1])) {
      // 到线路层级。
      // 判断
      if (!data.loaded) {
        // 未加载数据
        if (!state.loading) state.loading = true
        flag = true
        queue.add(() => _getChildNode(data, false))
      }
    }
  }
  if (flag)
    queue.onIdle().then(() => {
      state.canAdd = true
      state.loading = false
      // 刷新数据
      treeRef.value.setData(unref(treeData.value))
    })
}

// // 节点展开事件
// const handleNodeExpand = (data, node) => {
//   // 判断该节点是否需要获取数据
// }

// 点击添加到 table
const handleAddTreeNode = async () => {
  let checkedNodes = treeRef.value.getCheckedNodes()
  let cloneData = toRaw(checkedNodes)
  // let unLoadNodes = cloneData.filter(item => 'loaded' in item && !item.isLeaf && !item.loaded) // 未加载杆塔的节点

  let newTableData = cloneData
    .filter((item) => item.isLeaf)
    .map((item) => {
      let exist = state.tableData.find((row) => row.guid === item.guid)
      return {
        ...item,
        ...(exist || {}),
        parentDeviceGuid: item.lineGuid || '',
        parentDeviceName: item.lineName || ''
      }
    })
  _loadSmsRouteAndAirport(newTableData).then((data) => {
    state.tableData = data
  })
}

// 校验
const _validate = () => {
  if (!state.workNature) {
    $message.warning('请选择作业性质')
    return
  }

  return true
}

/**
 * 获取航迹和机场下拉集合
 * @param {*} tableData
 */
const _loadSmsRouteAndAirport = (tableData = []) => {
  return new Promise((resolve) => {
    // 判断是否需要重新调接口获取航线和机场
    // 巡检方式为固定机场，判断当前是否存在机场下拉列表， 变电站时，判断是否存在航迹
    // let list = tableData.filter(
    //   row =>
    //     (props.inspectionType === '1' && (!row.airportList || row.airportList?.length === 0)) ||
    //     (row.deviceType === 'sms' && (!row.routeList || row.routeList?.length === 0))
    // )
    let list = tableData.filter((item) => !item.hasLoadAirportAndRoute)
    if (list.length > 0) {
      state.loading = true
      // 获取 机场 和 sms（变电）航线
      let promises = list.map((item) =>
        fetchAirportAndRouteList({
          deviceGuid: item.guid,
          deviceType: item.deviceType,
          machineGuid: item.airportGuid
        })
      )

      Promise.all(promises)
        .then((results) => {
          let index = 0
          let data = toRaw(tableData).map((item) => {
            let { deviceRouteInfos: routeList = [], equipAirportInfos: airportList = [] } =
              results[index]?.data || {}
            // let routeList = deviceRouteInfos || [] // 航迹集合
            // let airportList = equipAirportInfos || [] // 机场集合
            let currentLoad = list.find((sms) => sms.guid === item.guid)
            if (currentLoad) {
              index++
              let routeGuid = item.routeGuid
              let routeDescription = item.routeDescription
              if (!routeGuid && routeList[0]) {
                routeGuid = routeList[0]?.routeGuid || '' // 默认取第一条
                routeDescription = routeList[0]?.routeDescription || '' // 默认取第一条
              }
              // let routeGuid = !item.routeGuid ? routeList[0]?.routeGuid || '' : item.routeGuid // 默认取第一条
              let airportGuid = item.airportGuid
              let airportName = item.airportName
              if (!airportGuid && airportList[0]) {
                airportGuid = airportList[0]?.airportGuid // 默认取第一条
                airportName = airportList[0]?.airportName // 默认取第一条
              }
              return {
                ...item,
                routeGuid: routeGuid, // 航线guid
                routeDescription: !routeGuid ? '最新航迹' : routeDescription || '',
                routeList: routeList,
                airportGuid: airportGuid, // 航线guid
                airportName,
                airportList: airportList,
                hasLoadAirportAndRoute: true
              }
            }
            return {
              ...item,
              // routeGuid: '',
              // routeDescription: '最新航迹',
              // routeList: [],
              // // airportGuid: '', // ??
              // airportList: [],
              hasLoadAirportAndRoute: true
            }
          })
          state.loading = false
          resolve(data)
        })
        .catch(() => {
          // $message.error('获取机场名称异常')
          resolve(tableData)
          state.loading = false
        })
    } else {
      resolve(tableData)
    }
  })
}

const _getNode = async (node) => {
  try {
    let nodeKey = `${node.parentGuid.split(node.lineGuid)[0]}${node.lineGuid}`

    let params = {
      lineGuid: nodeKey,
      isAutonomous: props.isAutonomous || '1',
      isAirport: '0'
    }
    if (props.inspectionType === '1') {
      // 固定机场
      params = { ...params, isAirport: '1', airportGuid: props.airportGuid } // , airspaceGuid: ''
    }
    let res = await fetchDeviceTreeOfChildren(params)
    if (res.success) {
      let results = res.data || []
      let currentNode = findTreeNode({ children: treeData.value }, nodeKey, 'guid')
      if (currentNode) {
        currentNode.children = results
        currentNode.loaded = true // 变更当前节点加载状态
        state.cacheCheckedNode.push(currentNode)
        nextTick(() => {
          // 刷新勾选状态
          // 获取最新的节点状态
          let updatedNode = treeRef.value.getNode(currentNode)
          treeRef.value.expandNode(updatedNode)
          // updatedNode.loaded = true // 变更当前节点加载状态
          // updatedNode.setChecked(true, true)
        })
      }
    }
  } catch (e) {
    //
  }
}

const _initChildNode = (list = []) => {
  list.forEach((node) => {
    queue.add(async () => {
      await _getNode(node)
    })
  })
  queue.onIdle().then(() => {
    state.loading = false
    state.canAdd = true
    // 刷新数据
    treeRef.value.setData(unref(treeData.value))

    nextTick(() => {
      if (state.cacheCheckedNode.length > 0) {
        state.cacheCheckedNode.forEach((node) => {
          // 勾选
          treeRef.value.setChecked(node.guid, true, true)
        })
        // 清空
        state.cacheCheckedNode = []
      }
    })
    _updateCheck()
  })
}

const _updateCheck = () => {
  nextTick(() => {
    // tree 数据回显
    props.selectedData.length > 0 &&
      treeRef.value &&
      treeRef.value.setCheckedKeys(props.selectedData.map((item) => item.guid))
  })
}

const _initTreeData = async () => {
  try {
    let params = {
      isAutonomous: props.isAutonomous || '1',
      isAirport: '0'
    }
    if (props.inspectionType === '1') {
      params = { ...params, isAirport: '1', airportGuid: props.airportGuid }
    }
    let res = (await fetchDeviceTree(params))?.data
    if (res.success) {
      let data = res.data || []
      let defaultExpandedArr = data.map((item) => item.guid) // 默认展开第一层
      if (props.selectedData.length > 0) {
        defaultExpandedArr = new Set(
          props.selectedData
            .map((item) => {
              let arr = item.parentGuid ? item.parentGuid.split('_') : []
              let result = []
              if (arr.length > 1) {
                let str = arr[0]
                for (let index = 1; index < arr.length; index++) {
                  const element = arr[index]
                  str = `${str}_${element}`
                  result.push(str)
                }
              }
              return result
            })
            .flat()
        ).toJSON()
      }
      treeData.value = data
      Object.assign(state, {
        // treeData: data,
        defaultExpandedKeys: defaultExpandedArr,
        onMounted: true
        // defaultCheckedKeys: props.selectedData.map(item => item.guid)
      })
      // 1、过滤非变电的作业对象
      let notSmsWorkObj = props.selectedData.filter((item) => item.deviceType !== 'sms')

      if (notSmsWorkObj.length > 0) {
        _initChildNode(notSmsWorkObj)
        return
      }
      _updateCheck()
    }
    Object.assign(state, {
      loading: false,
      canAdd: true
    })
  } catch (e) {
    Object.assign(state, {
      loading: false,
      canAdd: true,
      onMounted: true
    })
  }
}

onMounted(() => {
  nextTick(() => {
    if (treeBoxRef.value) {
      let { height } = treeBoxRef.value.getBoundingClientRect()
      state.visualHeight = height
      // state.onMounted = true
    }
  })

  if (props.selectedData.length > 0) {
    _loadSmsRouteAndAirport(props.selectedData).then((data) => {
      state.tableData = data
    })
    // _loadAirportData(props.selectedData).then(data => {
    //   state.tableData = data
    // })
  }

  _initTreeData()
})

defineExpose({
  data: toRef(state, 'tableData'),
  workNature: computed(() => {
    let tmp = props.workNatureList.find((item) => item.value === state.workNature)
    return tmp || {}
  }),
  validate: _validate
})
</script>
<style scoped lang="scss">
.left {
  height: 100%;
  width: 350px;
  overflow: auto;
  gap: 12px;

  .tree_wrapper {
    height: 100%;
    width: 100%;
    overflow: auto;
    ::deep {
      .el-tree {
        width: fit-content;
        min-width: 100%;
      }
    }
  }
  .btn_operate_box {
    text-align: center;
  }

  .node_item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* :deep {
      .el-tree-node__label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    } */
}
</style>
