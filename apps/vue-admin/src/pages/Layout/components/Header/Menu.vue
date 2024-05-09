<!--
 * @Author: CP
 * @Date: 2024-01-22 16:31:20
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div class="menu_box flex flex-1 flex-middle">
    <div
      v-for="menu in props.menuList"
      :key="menu.id"
      class="menu__item"
      :class="{ 'is-active': activeTopMenu?.id === menu.id }"
      @click="handleTopMenuClick(menu)"
    >
      {{ menu.name }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, defineProps, defineEmits, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
/**
 * 数据部分
 */
const emit = defineEmits(['onMenuClick']);

const props = defineProps({
  menuList: {
    type: Array,
    default: () => []
  }
});
const activeTopMenu = computed(() => store.getters.activeTopMenu);

const handleTopMenuClick = menu => {
  store.commit('UPDATE_TOP_MENU', menu);
  // 默认不展示侧边栏, 当点击一级菜单后展示侧边菜单
  store.commit('SET_SHOW_COLLAPSE', true);
  // emit('onMenuClick', menu)
  // TODO: 是否需要默认展示第一个菜单页
};

onMounted(() => {});
</script>
<style scoped lang="scss"></style>
