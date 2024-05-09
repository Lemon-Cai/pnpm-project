<!--
 * @Author: CP
 * @Date: 2024-02-26 13:20:24
 * @LastEditors: Please set LastEditors
 * @Description:
-->
<template>
  <el-dropdown>
    <img src="~@/assets/images/layout/logout.png" alt="" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleCloseOthersTags">
          <el-icon><MoreFilled /></el-icon>
          关闭其它</el-dropdown-item
        >
        <el-dropdown-item @click="handleCloseAllTags">
          <el-icon><CloseBold /></el-icon>
          关闭所有
        </el-dropdown-item>
        <el-dropdown-item @click="handleClearCacheTags">
          <el-icon><Delete /></el-icon>
          清除缓存
        </el-dropdown-item>
        <el-dropdown-item @click="handleLogout">
          <el-icon>
            <SwitchButton />
          </el-icon>
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- <div class="logout_wrapper" title="退出登录">
    <img src="~@/assets/images/layout/logout.png" alt="" @click="handleLogout" />
  </div> -->
</template>

<script setup>
// import { ref, reactive, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import i18n from '@/lang'
import { useRouter, useRoute } from 'vue-router'
import { resetRouter } from '@/router/router'
import { LOGIN_URL } from '@/config/constant'
import { useConfirm, useGlobalApi } from '@/hooks'
import { requestClearCache } from '@/api/user'
import { HOME_PAGE } from '@/config/constant'
/**
 * 数据部分
 */
const store = useStore()
const router = useRouter()
const t = i18n.global.t
const route = useRoute()

const { $message } = useGlobalApi()

const { confirm } = useConfirm()

//  关闭其他
const handleCloseOthersTags = () => {
  store.commit('DEL_OTHER_TAB', route.name)
}

// 关闭所有
const handleCloseAllTags = () => {
  // 清空选择的菜单
  store.commit('UPDATE_ACTIVE_MENU', '')
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

// 退出登录
const handleLogout = () => {
  confirm(t('logoutTip'), () => {
    store.dispatch('LogOut').then(() => {
      resetRouter()
      router.push({ path: LOGIN_URL })
    })
  })
}
</script>
<style scoped lang="scss">
// logout icon
.logout_wrapper {
  cursor: pointer;

  img {
    vertical-align: middle;
  }
}
</style>
