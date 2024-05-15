<!--
 * @Author: CP
 * @Date: 2024-03-06 14:32:15
 * @LastEditors: Please set LastEditors
 * @Description:
-->
<template>
  <CoreLayout layout="horizontal" background class="layout" v-loading="state.loading">
    <template #left>
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
              <span v-if="data.towerNum > 0">（{{ data.towerNum }}）</span>
            </template>
          </el-tree-v2>
        </div>

        <div class="btn_operate_box">
          <CoreButton type="primary" :disabled="!state.canAdd" @click="handleAddTreeNode"
            >添加</CoreButton
          >
        </div>
      </div>
    </template>
    <template #right>
      <CoreLayout background>
        <template #top>
          <CoreForm
            ref="formRef"
            show-search
            :list="formList"
            @search="handleSearch"
            @reset="handleReset"
          >
            <template #leftMenu>
              <CoreButton type="danger" :icon="Delete" @click="handleBatchDelete">
                批量删除
              </CoreButton>
            </template>
          </CoreForm>
        </template>
        <template #bottom>
          <div class="body flex flex-vertical">
            <div class="flex-1">
              <CoreTable
                ref="tableRef"
                row-key="guid"
                show-selection
                :data="state.tableData"
                :coloum="tableColumns"
                @selection-change="handleSelectionChange"
              >
                <template #sameTowerData="{ scope }">
                  <div>
                    {{ (scope.row.sameTowerData || []).map(item => item.sameTowerName).join(',') }}
                  </div>
                </template>
                <template #routeDescription="{ scope }">
                  <el-select v-if="scope.row.deviceType === 'sms'" v-model="scope.row.routeGuid">
                    <el-option
                      v-for="item in scope.row.routeList"
                      :key="item"
                      :value="item.routeGuid"
                      :label="item.routeDescription"
                    ></el-option>
                  </el-select>
                  <div v-else>{{ scope.row.routeDescription || '最新航迹' }}</div>
                </template>
                <template #airportName="{ scope }">
                  <el-select
                    v-model="scope.row.airportGuid"
                    v-if="scope.row.airportList && scope.row.airportList.length"
                  >
                    <el-option
                      v-for="item in scope.row.airportList"
                      :key="item.airportGuid"
                      :value="item.airportGuid"
                      :label="item.airportName"
                    ></el-option>
                  </el-select>
                  <p v-else>{{ scope.row.airportName }}</p>
                </template>
                <template #operator="{ scope }">
                  <CoreMenu
                    :menu="operateBtnList"
                    :data="scope.row"
                    @menu-click="handleClickOperate"
                  ></CoreMenu>
                </template>
              </CoreTable>
            </div>

            <div class="work_nature_box">
              <div class="el-form">
                <div class="el-form-item is-required asterisk-left">
                  <div class="el-form-item__label">作业性质</div>
                  <div class="el-form-item__content">
                    <el-select v-model="state.workNature">
                      <el-option
                        v-for="(item, index) in workNatureList"
                        :key="index"
                        :value="item.value"
                        :label="item.label"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </CoreLayout>
    </template>
  </CoreLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, toRaw, toRef, unref, nextTick } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import PQueue from 'p-queue/dist'
import { useDebounceFn } from '@vueuse/core'

import { FormComponentType } from '@/components/core-element/utils'
import { useGlobalApi } from '@/hooks'

import {
  fetchDeviceTree,
  fetchDeviceTreeOfChildren,
  fetchAirportAndRouteList
} from '@/api/workManagement/orderManage/orderList'
import { findTreeNode } from '@/tools'

// const PQueue = require('p-queue/dist')

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
const { $confirm, $message } = useGlobalApi()

const tableRef = ref()
const treeRef = ref()
const treeBoxRef = ref()

// 过滤输入
const filterText = ref()

const treeData = ref([])

const state = reactive({
  loading: true,
  onMounted: false,
  workNature: props.workNature || '',
  treeData: [],

  visualHeight: 200, // 虚拟滚动高度, 默认 200
  defaultExpandedKeys: [], // 默认展开节点
  defaultCheckedKeys: [], // 默认选择的tree node

  cacheCheckedNode: [],

  // cacheTableData: [], // 筛选时缓存
  tableData: props.selectedData || [],
  selectRows: [],
  canAdd: false
})
const formList = reactive([
  {
    label: '线路名称',
    prop: 'parentDeviceName',
    type: FormComponentType.INPUT,
    span: 8,
    attributes: {
      placeholder: '请输入线路名称',
      maxLength: 100
    }
  },
  {
    label: '作业对象',
    prop: 'towerName',
    type: FormComponentType.INPUT,
    span: 8,
    formItem: {
      // 'label-width': 0
    },
    attributes: {
      placeholder: '请输入',
      maxLength: 100
    }
  }
])

const tableColumns = reactive(
  [
    {
      prop: 'voltageLevel',
      label: '电压等级'
    },
    props.inspectionType === '1' && {
      prop: 'airportName',
      label: '机场名称',
      slot: 'airportName',
      width: 150
    },
    {
      prop: 'parentDeviceName',
      label: '线路名称',
      width: 200
    },
    {
      prop: 'name',
      label: '作业对象',
      width: 200
    },
    {
      prop: 'routeDescription',
      slot: 'routeDescription',
      label: '航线',
      width: 150
    },
    {
      prop: 'sameTowerData',
      slot: 'sameTowerData',
      label: '同杆杆塔',
      width: 150
    },
    {
      prop: 'operator',
      label: '操作',
      fixed: 'right'
    }
  ].filter(Boolean)
)

const operateBtnList = reactive([
  {
    name: '删除',
    type: 'danger',
    event: 'handleDelete'
  }
])

const debouncedFn = useDebounceFn(async val => {
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
            state.cacheCheckedNode.forEach(node => {
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
const handleClickNode = data => {
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
    .filter(item => item.isLeaf)
    .map(item => {
      let exist = state.tableData.find(row => row.guid === item.guid)
      return {
        ...item,
        ...(exist || {}),
        parentDeviceGuid: item.lineGuid || '',
        parentDeviceName: item.lineName || ''
      }
    })
  _loadSmsRouteAndAirport(newTableData).then(data => {
    state.tableData = data
  })
}

// 搜索
const handleSearch = data => {
  // state.tableData = state.tableData.filter(item => {})
  let { parentDeviceName, towerName } = data

  state.tableData = toRaw(state.tableData).filter(item => {
    let bool = true
    // 线路
    parentDeviceName && (bool = bool && item.parentDeviceName.includes(parentDeviceName))
    // 巡检频次
    // lineName && (bool = bool && item.name.includes(lineName))
    // 杆塔
    towerName && (bool = bool && item.name.includes(towerName))
    return bool
  })
}
// 重置
const handleReset = () => {
  handleAddTreeNode()
}

const handleBatchDelete = () => {
  if (state.selectRows.length > 0) {
    // TODO:
    _del(state.selectRows)
  } else {
    $message.warning('请至少选择一条数据')
  }
}

const _del = (data = []) => {
  $confirm('确认删除吗？', '提示', {
    type: 'warning'
  }).then(() => {
    let newTableData = state.tableData.filter(item => !data.find(row => row.guid === item.guid))

    Object.assign(state, {
      tableData: newTableData,
      selectRows: []
    })

    // treeRef.value.setCheckedNodes(state.tableData)
    treeRef.value.setCheckedKeys(newTableData.map(item => item.guid))

    tableRef.value?.tableRef && tableRef.value.tableRef?.clearSelection()
  })
}

const handleSelectionChange = rows => {
  state.selectRows = rows
}

const handleClickOperate = (menu, row) => {
  switch (menu.event) {
    case 'handleDelete': {
      _del([row])
      break
    }
  }
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
  return new Promise(resolve => {
    // 判断是否需要重新调接口获取航线和机场
    // 巡检方式为固定机场，判断当前是否存在机场下拉列表， 变电站时，判断是否存在航迹
    // let list = tableData.filter(
    //   row =>
    //     (props.inspectionType === '1' && (!row.airportList || row.airportList?.length === 0)) ||
    //     (row.deviceType === 'sms' && (!row.routeList || row.routeList?.length === 0))
    // )
    let list = tableData.filter(item => !item.hasLoadAirportAndRoute)
    if (list.length > 0) {
      state.loading = true
      // 获取 机场 和 sms（变电）航线
      let promises = list.map(item =>
        fetchAirportAndRouteList({
          deviceGuid: item.guid,
          deviceType: item.deviceType,
          machineGuid: item.airportGuid
        })
      )

      Promise.all(promises)
        .then(results => {
          let index = 0
          let data = toRaw(tableData).map(item => {
            let { deviceRouteInfos = [], equipAirportInfos = [] } = results[index]?.data || {}
            let routeList = deviceRouteInfos || [] // 航迹集合
            let airportList = equipAirportInfos || [] // 机场集合
            let currentLoad = list.find(sms => sms.guid === item.guid)
            if (currentLoad) {
              index++
              let routeGuid = !item.routeGuid ? routeList[0]?.routeGuid || '' : item.routeGuid // 默认取第一条
              let airportGuid = !item.airportGuid
                ? airportList[0]?.airportGuid || ''
                : item.airportGuid // 默认取第一条
              return {
                ...item,
                routeGuid: routeGuid, // 航线guid
                routeDescription: !routeGuid ? '最新航迹' : '',
                routeList: routeList,
                airportGuid: airportGuid, // 航线guid
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

const _getNode = async node => {
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
  list.forEach(node => {
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
        state.cacheCheckedNode.forEach(node => {
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
      treeRef.value.setCheckedKeys(props.selectedData.map(item => item.guid))
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
    let res = await fetchDeviceTree(params)
    if (res.success) {
      let data = res.data || []
      let defaultExpandedArr = data.map(item => item.guid) // 默认展开第一层
      if (props.selectedData.length > 0) {
        defaultExpandedArr = new Set(
          props.selectedData
            .map(item => {
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
      let notSmsWorkObj = props.selectedData.filter(item => item.deviceType !== 'sms')

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
    _loadSmsRouteAndAirport(props.selectedData).then(data => {
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
    let tmp = props.workNatureList.find(item => item.value === state.workNature)
    return tmp || {}
  }),
  validate: _validate
})
</script>
<style scoped lang="scss">
.layout {
  padding: 0;
  height: 60vh;
  .core-layout {
    padding-top: 0;
    padding-bottom: 0;
    :deep {
      .horizontal-left {
        width: 300px;
      }
    }
  }

  .left {
    height: 100%;
    width: 350px;
    overflow: auto;
    gap: 12px;

    .tree_wrapper {
      height: 100%;
      width: 100%;
      overflow: auto;
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
}
.body {
  height: 100%;
  gap: 12px;
  overflow: hidden;

  .flex-1 {
    overflow: auto;
  }
  .work_nature_box {
    width: 50%;
    .el-form-item__label {
      width: 120px;
    }
  }
}
</style>
