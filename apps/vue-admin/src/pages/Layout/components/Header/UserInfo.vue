<!--
 * @Author: CP
 * @Date: 2024-02-26 11:22:54
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div class="user_info_wrapper flex">
    <el-dropdown>
      <div class="avatar flex flex-middle" @click="handleGotoUserInfo">
        <img src="~@/assets/images/layout/user.png" alt="avatar" />
        <!-- <span class="user_name">{{ userInfo.real_name }}</span> -->
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item> 账号：{{ userInfo.account }} </el-dropdown-item>
          <el-dropdown-item> 用户名：{{ userInfo.nick_name }} </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
/**
 * 数据部分
 */
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.getters.userInfo)

// 跳转到用户信息
const handleGotoUserInfo = () => {
  // router.push('/info/index')
}
</script>
<style scoped lang="scss">
// user-info
.user_info_wrapper {
  position: relative;
  overflow: hidden;

  .el-dropdown {
    width: 100%;
  }

  .avatar {
    cursor: pointer;
    width: 100%;
    height: 100%;
    gap: 4px;
  }

  .user_name {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
