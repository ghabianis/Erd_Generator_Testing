<template>
  <div class="pagination__wrapper">
    <div>
      <label class="text-color"
        >{{ $t("entityList.pagination.itemsPerPage") }}
      </label>
      <select
        :value="itemsPerPage"
        class="pagination__select text-color"
        @change="(e) => setItemsPerPage(e)"
      >
        <option
          v-for="(item, index) in pagesArray"
          :key="index"
          :value="item"
          :label="`${item}`"
        >
          {{ item }}
        </option>
      </select>
    </div>

    <div class="pagination-footer text-color">
      <el-pagination
        :currentPage="page"
        @current-change="currentPageChange"
        :page-size="itemsPerPage"
        layout="prev, pager, next"
        :total="total"
        :hide-on-single-page="false"
        background
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from "@vue/reactivity";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    itemsPerPage: {
      type: Number,
      default: parseInt(localStorage.getItem("take") || "5"),
    },
    setItemsPerPage: { type: Function, required: true },
    page: { type: Number, required: true },
    currentPageChange: { type: Function, required: true },
    total: { type: Number, required: true },
    currentPage: { type: Number, default: 1 },
    pagesArray: {
      type: Array,
      default: () => [5, 10, 25, 50, 75, 100],
    },
  },
  components: {},
  setup(props) {
    const pageRange = computed(() => {
      return {
        start: props.itemsPerPage * props.page - props.itemsPerPage + 1,
        end: props.itemsPerPage * props.page,
      };
    });
    return {
      pageRange,
    };
  },
});
</script>

<style lang="scss" scoped>
.pagination__wrapper {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  @media screen and (max-width: 350px) {
    flex-direction: column;
    justify-items: center;
  }
}
.pagination-footer {
  background: transparent;
}
.pagination-footer :deep(.el-pagination.is-background .btn-next),
:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .el-pager li),
:deep(.el-pagination.is-background .btn-prev:disabled) {
  background: none;
}
:deep(.el-pagination .btn-prev .el-icon),
:deep(.el-pagination .btn-next .el-icon) {
  font-size: 10px;
}
.pagination__select {
  border: none;
  outline: none;
  background: transparent;

  cursor: pointer;
  margin-right: 30px;
  @media screen and (max-width: 600px) {
    margin-right: 5px;
  }
  option {
    color: $black;
  }
}
</style>
