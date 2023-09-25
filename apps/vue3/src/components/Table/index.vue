<template>
  <div class="my-table" :class="`my-table--${size}`">
    <el-table
      :ref="tableRef || 'filterTable'"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableData"
      :border="border"
      :cell-style="cellStyle"
      :height="height"
      :max-height="maxHeight"
      tooltip-effect="dark"
      @selection-change="selectionChange"
      @sort-change="sortChange"
    >
      <el-table-column
        v-if="selection"
        type="selection"
        width="45"
        fixed
        align="center"
        :selectable="checkSelect"
      >
      </el-table-column>
      <el-table-column
        v-if="showIndex"
        label="序号"
        :width="indexWidth"
        type="index"
        align="center"
      >
        <template #default="scope">
          <span>{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <template v-for="(item, index) in columns">
        <!-- solt 自定义列-->
        <!--
        自定义列的使用方法:
        在使用插槽时#后跟slotType
        <template #createTime="scope">
        <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
        -->
        <template v-if="item.type === 'slot'">
          <el-table-column
            :class-name="item.class"
            :key="index"
            :width="item.width"
            :min-width="item.minWidth"
            :prop="item.prop"
            :label="item.label"
            :align="item.align ? item.align : 'center'"
            :fixed="item.fixed ? item.fixed : false"
          >
            <template #default="scope">
              <slot
                :name="item.slotType"
                :row="scope.row"
                :index="scope.$index"
                :column="scope.column"
              />
            </template>
          </el-table-column>
        </template>
        <!--普通表格-->
        <template v-else>
          <el-table-column
            :show-overflow-tooltip="
              item.showOverflowTooltip === undefined ? true : item.showOverflowTooltip
            "
            v-if="item.visible !== false"
            :key="index"
            :sortable="item.sortable"
            :prop="item.prop"
            :label="item.label"
            :formatter="item.formatter || ((row) => formatEmpty(row, item))"
            :width="item.width"
            :min-width="item.minWidth"
            :align="item.align ? item.align : 'center'"
            :fixed="item.fixed ? item.fixed : false"
          ></el-table-column>
        </template>
      </template>
    </el-table>
    <pagination
      v-if="showPagination"
      v-show="total > 0"
      :total="total"
      :autoScroll="autoScroll"
      :pagerCount="pagerCount"
      v-model:page="currentPage"
      v-model:limit="pageSize"
      :page-sizes="pageSizes"
      @pagination="handlePagination"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 表单数据
  tableData: {
    type: Array,
    default() {
      return []
    }
  },
  // 表单大小
  size: {
    type: String,
    default: 'normal'
  },
  // 表单ref
  tableRef: {
    type: String,
    default: ''
  },
  // 数据列表配置
  columns: {
    type: Array,
    default() {
      return []
    }
  },
  // 是否开启翻页时自动回到顶部
  autoScroll: {
    type: Boolean,
    default: true
  },
  // 序号的宽度
  indexWidth: {
    type: Number,
    default: 80
  },
  // 行样式
  tableRowClassName: {
    type: Function,
    default() {
      return () => {}
    }
  },
  // 移动端页码按钮的数量端默认值5
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7
  },
  // 分页
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50]
    }
  },
  // 边框
  border: { type: Boolean, default: false },
  // 高度
  height: { type: [Number, String], default: null },
  // 最大高度
  maxHeight: { type: [Number, String], default: null },
  // 加载状态
  loading: { type: Boolean, default: false },
  // 是否多选
  selection: { type: Boolean, default: false },
  // 单元格的 style 的回调方法
  cellStyle: {
    type: Function,
    default() {
      return () => {}
    }
  },
  // 是否展示翻页组件
  showPagination: { type: Boolean, default: true },
  // 是否展示序号
  showIndex: { type: Boolean, default: false },
  // 总数
  total: {
    type: Number,
    default: 20
  },
  // pagination的page
  page: {
    type: Number,
    default: 1
  },
  // pagination的limit
  limit: {
    type: Number,
    default: 10
  },
  // 查询是否能选中的数据
  checkData: {
    type: Array,
    default() {
      return []
    }
  }
})
const emit = defineEmits([])

const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})
const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})
const formatEmpty = (row, item) => {
  return row[item.prop] || row[item.prop] === 0 ? row[item.prop] : item.emptyText || ''
}

function checkSelect(row) {
  let list = props.checkData
  let isSelect = true
  for (let i of list) {
    if (row.id === i.id) {
      isSelect = false
      return
    }
  }
  return isSelect
}

function selectionChange(selection) {
  emit('selectionChange', selection)
}

function sortChange(filters) {
  emit('sortChange', filters)
}

function handlePagination(data) {
  if (data.page !== currentPage.value || data.limit !== props.limit) {
    emit('update:page', data.page)
    emit('update:limit', data.limit)
    emit('pagination', data)
  }
}
</script>

<style scoped lang="scss"></style>
