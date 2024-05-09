<!--
 * @Author: CP
 * @Date: 2024-02-23 14:22:51
 * @LastEditors: Please set LastEditors
 * @Description:
-->
<template>
  <!-- tab 操作 -->
  <el-dropdown class="tab_actions">
    <div class="more_btn">
      <span>更多</span>
    </div>
    <template #dropdown>
      <el-dropdown-menu class="more_dialog">
        <!-- <el-dropdown-item @click.native="handleCloseOthersTags">{{ $t('tagsView.closeOthers') }}</el-dropdown-item> -->
        <el-dropdown-item @click="handleCloseOthersTags">关闭其他</el-dropdown-item>
        <el-dropdown-item @click="handleCloseAllTags">关闭所有</el-dropdown-item>
        <el-dropdown-item @click="handleClearCacheTags">清除缓存</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

import { HOME_PAGE } from '@/config/constant'
import { useConfirm, useGlobalApi } from '@/hooks'
import { requestClearCache } from '@/api/user'

const store = useStore()
const router = useRouter()
const route = useRoute()
const { $message } = useGlobalApi()
/**
 * 数据部分
 */
const { confirm } = useConfirm()
//  关闭其他
const handleCloseOthersTags = () => {
  store.commit('DEL_OTHER_TAB', route.name)
}

// 关闭所有
const handleCloseAllTags = () => {
  // 清空选择的菜单
  store.commit('UPDATE_ACTIVE_MENU', '')
  // 关闭所有页签
  store.commit('DEL_ALL_TAB')
  router.push(`/${HOME_PAGE.path}`)
}

// 清除缓存
const handleClearCacheTags = () => {
  confirm('是否需要清除缓存?', () => {
    requestClearCache().then(() => {
      $message.success('清除完毕')
    })
  })
}
</script>
<style scoped lang="scss"></style>
