<!--
 * @Author: CP
 * @Date: 2024-01-19 14:22:51
 * @LastEditors: Please set LastEditors
 * @Description:
-->
<template>
  <template v-for="subItem in menuList" :key="subItem.path">
    <el-sub-menu v-if="subItem.children?.length" :index="subItem.path">
      <template #title>
        <!-- <el-icon v-if="subItem.meta.icon">
          <component :is="subItem.meta.icon"></component>
        </el-icon> -->
        <!-- <i :class="subItem.meta.icon"></i> -->
        <SvgIcon is-full-name :name="subItem.meta.icon"></SvgIcon>

        <span class="menu_text">{{ getTitle(subItem) }}</span>
      </template>
      <SubMenu :menu-list="subItem.children" />
    </el-sub-menu>
    <el-menu-item
      v-else
      :index="subItem.path"
      :class="{ hasIcon: subItem.meta.showIcon }"
      @click="handleClickMenu(subItem)"
    >
      <!-- <el-icon v-if="subItem.meta.icon">
        <component :is="subItem.meta.icon"></component>
      </el-icon> -->
      <SvgIcon v-if="subItem.meta.showIcon" is-full-name :name="subItem.meta.icon"></SvgIcon>

      <!-- <i v-if="subItem.meta.showIcon" :class="subItem.meta.icon"></i> -->
      <template #title>
        <span class="menu_text">{{ getTitle(subItem) }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup>
import { computed, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import i18n from '@/lang'

const router = useRouter()
const store = useStore()

defineProps({
  menuList: {
    type: Array, // Menu.MenuOptions[]
    default: () => []
  }
})
const emit = defineEmits(['onMenuClick'])

// const { flattenMenuList, updateActiveMenu } = useMenuStore()

const flattenMenuList = computed(() => store.getters.flattenMenuList || [])
const screen = computed(() => store.getters.screen)


// 点击菜单
const handleClickMenu = subItem => {
  emit('onMenuClick', subItem)
  // 根据屏幕尺寸动态显示 侧边栏
  if (screen.value < 1) store.commit('SET_COLLAPSE', false)

  const { meta, path, id } = subItem
  if (meta.isLink) return window.open(meta.isLink, '_blank')

  store.commit('UPDATE_ACTIVE_MENU', path)
  const res = flattenMenuList.value.find(item => item.id === id)
  if (res) {
    router.push(res.path)
  }
}

const getTitle = ({ meta = {}, name }) => {
  let newTitle = typeof meta.title === 'function' ? meta.title() : meta.title

  if (meta.i18n)
    return i18n.global.te(meta.i18n) ? i18n.global.t(meta.i18n) : newTitle ? newTitle : name

  return newTitle ? newTitle : name
}
</script>

<style lang="scss" scoped></style>
