<!--
 * @Author: CP
 * @Date: 2024-05-14 16:45:57
 * @Description: 
-->
<template>
  <div class="left flex flex-vertical">
    <el-input v-model="filterText" placeholder="请输入查询条件"></el-input>

    <div ref="treeBoxRef" class="tree_wrapper flex-1">
      <el-tree
        ref="treeRef"
        node-key="guid"
        :data="state.treeData"
        :props="{
          value: 'guid',
          label: 'name',
          children: 'children',
          isLeaf: 'isLeaf'
        }"
        lazy
        :load="handleLoadData"
        show-checkbox
        :filter-node-method="handleFilterNode"
        :default-expanded-keys="state.defaultExpandedKeys"
        @check="handleCheck"
        @node-click="handleNodeClick"
      >
        <template #default="{ data }">
          <div class="node_item" :title="data.name">
            {{ data.name }}
          </div>
          <span v-if="data.nextNodeNum > 0">（{{ data.nextNodeNum }}）</span>
        </template>
      </el-tree>
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

import { fetchDeviceTree, fetchDeviceTreeOfChildren, fetchAirportAndRouteList } from '@/api/SearchTree'

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

const state = reactive({
  loading: true,
  workNature: props.workNature || '',
  originTreeData: [],
  treeData: [],
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

watch(filterText, async (val) => {
  if (props.professionalCategory === 'sms') {
    treeRef.value && treeRef.value.filter(val)
  } else {
    // state.cacheLazyArr = [...treeRef.value.getCheckedNodes()] // 缓存当前已勾选的节点

    treeRef.value && treeRef.value.filter(val)

    // let idList = []

    // if (val.trim() !== '') {
    //   // 1.输入状态时，取消懒加载，重新发起请求获取数据并赋值给data
    //   treeRef.value.store.lazy = false
    //   state.treeData = _filterTree(toRaw(state.originTreeData), val)

    //   nextTick(() => {
    //     let nodes = treeRef.value.store._getAllNodes()
    //     for (let i in nodes) {
    //       // nodes[i].expanded = true // 所有节点都展开
    //       nodes[i].expanded && nodes[i].expanded?.()
    //     }
    //     // 2. 选中前页已选中的状态

    //     state.cacheLazyArr.map(item => {
    //       idList.push(item.id)
    //     })
    //     //
    //     treeRef.value.setCheckedKeys(idList)
    //     state.checkedArr = [...treeRef.value.getCheckedNodes()]
    //   })
    // } else {
    //   // 2.清空输入值状态，实行懒加载，重新获取一级组织架构
    //   state.searchArr = treeRef.value.getCheckedNodes()
    //   treeRef.value.store.lazy = true
    //   // this.getMember();
    //   state.treeData = await _getTree()
    // }
  }
})

// 搜索
// const _filterTree = (data, filterVal) => {
//   let result = deepClone(data)

//   function loop(nodes) {
//     // if (Array.isArray(nodes)) {
//     //   nodes.forEach(item => loop(item))
//     // } else if (typeof nodes === 'object' && nodes !== null) {
//     //   if ('name' in nodes && nodes.name.includes(filterVal)) {
//     //     result.push(nodes)
//     //   }
//     //   for (let key in nodes) {
//     //     loop(nodes[key])
//     //   }
//     // }
//     // let childNodes = node.children || []
//     nodes.forEach(child => {
//       child.children = child.children.filter(item => (item.name || '').includes(filterVal))
//       loop(child.children)
//     })
//   }

//   loop(data)
//   return result
// }

// const _getTree = async () => {
//   let params = {
//     isAutonomous: props.isAutonomous || '1',
//     isAirport: '0'
//   }
//   if (props.inspectionType === '1') {
//     params = { ...params, isAirport: '1', airportGuid: props.airportGuid }
//   }
//   let res = await fetchDeviceTree(params)
//   if (res.success) {
//     return Promise.resolve(res.data || [])
//   }
//   return Promise.resolve([])
// }

const _getTreeData = async (node, resolve) => {
  let data = toRaw(state.treeData)
  if (data.length <= 0) {
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
        data = res.data || []
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
        Object.assign(state, {
          treeData: data,
          originTreeData: data
          // defaultExpandedKeys: defaultExpandedArr
        })
        nextTick(() => {
          // tree 数据回显
          props.selectedData.length > 0 &&
            treeRef.value &&
            treeRef.value.setCheckedKeys(props.selectedData.map((item) => item.guid))

          state.defaultExpandedKeys = defaultExpandedArr
          // 表格数据回显
          // state.tableData = props.selectedData
        })
      }
    } catch (error) {
      console.log('error = ', error)
    }
  }

  if (node.level === 0) {
    resolve(data)
  } else {
    // resolve(data.find(item => item.guid === node.data.guid)?.children || [])
    resolve(node.data?.children || [])
  }
  state.loading = false
  state.canAdd = true
}
const _getChildNode = async (node, resolve) => {
  if (!node.loaded && node.data.hasChildren) {
    // 未加载 且 判断 是否存在子集
    try {
      // 数据加载过程中，禁止点击添加按钮
      state.canAdd = false
      // let method = getTowerByLineGuid
      let params = {
        lineGuid: node.data.guid,
        isAutonomous: props.isAutonomous || '1',
        isAirport: '0'
      }
      if (props.inspectionType === '1') {
        // 固定机场
        // method = fetchTowerOfDeviceTreeByAirport
        params = { ...params, isAirport: '1', airportGuid: props.airportGuid } // , airspaceGuid: ''
      }
      let res = await fetchDeviceTreeOfChildren(params)
      if (res.success) {
        node.data.loaded = true // 变更当前节点加载状态

        let results = res.data || []
        resolve(results)
        nextTick(() => {
          results.forEach((item) => {
            let childNode = treeRef.value.getNode(item)
            if (!childNode?.loaded) {
              childNode?.expand?.()
            }
            if (item.children?.length > 0) {
              _expandNode(item)
            }
          })
        })
      } else {
        resolve([])
      }
      state.canAdd = true
    } catch (e) {
      resolve([])
      state.canAdd = true
    }
  } else {
    resolve(node?.data?.children || [])
    state.canAdd = true
  }
}

// 公司-》单位-》专业-》电压-》变电站-》线路-》主分支-》杆塔
// 变电 只到 变电站层级
const handleLoadData = async (node, resolve) => {
  if (node.data.deviceType === 'sms') {
    //
    _getTreeData(node, resolve)
  } else {
    if (node.data.nodeType) {
      if (['line'].includes(node.data.nodeType.split('_')[1])) {
        _getChildNode(node, resolve)
      } else if (['branch', 'tower'].includes(node.data.nodeType.split('_')[1])) {
        resolve(node?.data?.children || [])
      } else {
        resolve(node?.data?.children || [])
      }
    } else {
      _getTreeData(node, resolve)
    }
  }
}

// 过滤
const handleFilterNode = (value, data) => {
  if (!value) return true
  return (data.name || '').includes(value)
}

const _expandNode = (node) => {
  let treeNode = treeRef.value.getNode(node)
  // 循环遍历展开所有子节点， 手动触发懒加载请求
  ;(treeNode.data.children || []).forEach((item) => {
    let childNode = treeRef.value.getNode(item)
    if (!childNode?.loaded) {
      childNode?.expand?.()
    }
    if (item.children?.length > 0) {
      _expandNode(item)
    }
  })
}

const handleCheck = (node) => {
  let currentNode = treeRef.value.getNode(node)

  if (!currentNode.loaded) {
    //
    currentNode.expand() // 展开当前一级节点
  }
  _expandNode(node)
}

// 点击树节点
const handleNodeClick = () => {}

// 点击添加到 table
const handleAddTreeNode = async () => {
  let checkedNodes = treeRef.value.getCheckedNodes()
  let cloneData = toRaw(checkedNodes)

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
  // let res = await _loadChildTreeData(unLoadNodes)
  // res.forEach(item => {
  //   newTableData.push(...item)
  // })

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
          deviceGuid: item.cuGuid,
          deviceType: item.deviceType,
          machineGuid: item.airportGuid
        })
      )

      Promise.all(promises)
        .then((results) => {
          let index = 0
          let data = toRaw(tableData).map((item) => {
            let { deviceRouteInfos = [], equipAirportInfos = [] } = results[index]?.data || {}
            let routeList = deviceRouteInfos || [] // 航迹集合
            let airportList = equipAirportInfos || [] // 机场集合
            let currentLoad = list.find((sms) => sms.guid === item.guid)
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

onMounted(() => {
  if (props.selectedData.length > 0) {
    _loadSmsRouteAndAirport(props.selectedData).then((data) => {
      state.tableData = data
    })
    // _loadAirportData(props.selectedData).then(data => {
    //   state.tableData = data
    // })
  }
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
  width: 100%;
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
</style>
