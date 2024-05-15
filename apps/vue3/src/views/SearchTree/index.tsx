/*
 * @Author: CP
 * @Date: 2024-05-14 15:07:32
 * @Description:
 */
import { defineComponent } from 'vue'

import style from './searchTree.module.scss'
// 项目开发中的页面
// import SearchTree_v2Vue from "./SearchTree_v2.vue"
// import SearchTree_v3Vue from "./SearchTree_v3.vue"
// import SearchTree_v4Vue from "./SearchTree_v4.vue"

// 拆分的组件
import SearchTree_v2Vue from './Tree_v2.vue'
// import SearchTree_v3Vue from "./SearchTree_v3.vue"
// import SearchTree_v4Vue from "./SearchTree_v4.vue"

export default defineComponent({
  setup() {
    return () => (
      <c-page class="custom_page">
        <c-header class={style.pageHeader}>
          需求：
          <p>1、基于element-plus的实现一个搜索树（数据量超过 10M ），支持多选</p>
          <p>2、点击树节点，判断是否有下一层级，是否加载数据</p>
          <p>3、勾选父级节点，需要展示数据，如果没有加载过数据则加载数据并展开勾选新加载的数据</p>
          {/* 基于element-plus的搜索树，树不复杂（数据量超过 10M ），但结合checkbox 和 搜索有点烦人 */}
        </c-header>
        <c-content>
          <div class={`flex ${style.flex}`}>
            <div class="flex-1">
              <SearchTree_v2Vue />
            </div>
            <div class="flex-1">{/* <SearchTree_v3Vue /> */}</div>
            <div class="flex-1">{/* <SearchTree_v4Vue /> */}</div>
          </div>
        </c-content>
      </c-page>
    )
  }
})
