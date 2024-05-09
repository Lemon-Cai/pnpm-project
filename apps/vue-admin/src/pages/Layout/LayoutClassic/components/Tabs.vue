<template>
  <div class="tabs__box">
    <div class="tabs-menu">
      <el-tabs
        v-model="tabsMenuValue"
        type="card"
        @tab-click="handleTabClick"
        @tab-remove="handleTabRemove"
      >
        <el-tab-pane
          v-for="item in tabsMenuList"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :closable="item.close"
        >
          <template #label>
            <!-- <el-icon v-if="item.icon && tabsIcon" class="tabs-icon">
              <component :is="item.icon"></component>
            </el-icon> -->
            <div class="custom_tab_item">{{ item.title }}</div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <!-- 更多操作 -->
      <div class="tab_extra_wrapper flex flex-middle" v-if="route.meta?.isFull">
        <el-tooltip content="全屏">
          <span style="font-size: 26px; display: flex" @click="handleFullScreen">
            <el-icon><FullScreen /></el-icon>
          </span>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
// import Sortable from 'sortablejs'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
// import MoreButton from '@/page/Layout/components/Tabs/MoreButton.vue'
import emitter from '@/utils/eventBus'
import { FULL_SCREEN_EVENT } from '@/config/constrant'
const route = useRoute()
const router = useRouter()
const store = useStore()

const tabsMenuValue = ref(route.name)
const tabsMenuList = computed(() => store.getters.tagList || [])
const flattenMenuList = computed(() => store.getters.flattenMenuList || [])

const getTitle = routeItem => {
  let title = routeItem.meta.title
  // if (!title) {
  //   title = item.query?.title || item.name
  // }
  if (typeof title === 'function') {
    return title(routeItem)
  }
  return title
}

// 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
watch(
  () => route.name,
  () => {
    // 如果meta中设置是全屏,或者不需要再tab栏展示
    if (route.meta.isFull || route.meta.isTab === false) return
    tabsMenuValue.value = route.name
    const tabsParams = {
      icon: route.meta.icon,
      title: getTitle(route),
      path: route.fullPath,
      name: route.name,
      close: !route.meta.isAffix,
      params: route.params,
      query: route.query
    }
    store.commit('ADD_TAB', tabsParams)
  },
  { immediate: true }
)

// 初始化需要固定的 tabs
const initTabs = () => {
  // const routes = router.getRoutes()
  flattenMenuList.value.forEach(item => {
    if (item.meta.isAffix && !item.meta.isHide && !item.meta.isFull) {
      const tabsParams = {
        icon: item.meta.icon,
        title: item.meta.title,
        path: item.path,
        name: item.name,
        close: !item.meta.isAffix
      }
      // 固定的tab在左侧
      store.commit('ADD_TAB', tabsParams)
    }
  })
}

// // tabs 拖拽排序
// const tabsDrop = () => {
//   Sortable.create(document.querySelector('.el-tabs__nav') as HTMLElement, {
//     draggable: '.el-tabs__item',
//     animation: 300,
//     onEnd({ newIndex, oldIndex }) {
//       const tabsList = [...tabStore.tabsMenuList]
//       const currRow = tabsList.splice(oldIndex as number, 1)[0]
//       tabsList.splice(newIndex as number, 0, currRow)
//       tabStore.setTabs(tabsList)
//     }
//   })
// }

// Tab Click
const handleTabClick = tabItem => {
  const { name } = tabItem.props
  let tmp = tabsMenuList.value.find(item => item.name === name)
  if (tmp) {
    const { path, params = {}, query = {} } = tmp
    router.push({
      path: path,
      params,
      query
    })
  }
}

// Remove Tab
const handleTabRemove = name => {
  if (name == route.name) {
    // 把当前的删除了
    // 找到当前的索引
    let index = tabsMenuList.value.findIndex(item => item.name === name)
    if (index !== -1) {
      const nextTab = tabsMenuList.value[index + 1] || tabsMenuList.value[index - 1]
      if (!nextTab) return
      store.commit('DEL_TAB', name)
      // 跳转另一个页面
      router.push({
        path: nextTab.path,
        query: nextTab.query
      })
    }
  } else {
    store.commit('DEL_TAB', name)
  }
}

const handleFullScreen = () => {
  store.commit('SET_FULLSCREN', true)
  emitter.emit(FULL_SCREEN_EVENT)
}

onMounted(() => {
  // tabsDrop()
  initTabs()
})
</script>

<style scoped lang="scss"></style>
