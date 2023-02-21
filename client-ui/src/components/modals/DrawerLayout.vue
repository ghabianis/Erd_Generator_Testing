<template><div style="width: 100%">
  <div class="mx-auto overflow-hidden" :style="{ maxWidth: maxWidth }">
    <div class="mx-auto" :id="id">
      <div class="modal-header" v-if="showHeader">
        <slot name="header">
          <div class="d-flex align-items-center">
            <div @click="closeFunction" class="btn btn-sm btn-icon btn-active-color-primary" data-bs-dismiss="modal">
              <span class="svg-icon svg-icon-1">
                <img src="/svg/icons/arr063.svg" />
              </span>
            </div>
            <slot name="header-title">
              <h3 class="mb-0" style="margin-left: 5px;">{{ title }}</h3>
            </slot>
          </div>
          <slot name="header-right-content"></slot>
        </slot>
      </div>
      <div class="drawer-body">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
  import {} from "vue";
  import { setDrawer } from "@/core/helpers/config";

  const props = defineProps({
  title: String,
  maxWidth: { type: String, default: "550px" },
  id: { type: String },
  showHeader: { type: Boolean, default: true },
  closeFunction: { type: Function },
  })
</script>
<style lang="scss" scoped>
  .drawer-body {
overflow: auto;
height: calc(100vh - 81px);
padding: 10px 10px 10px 17px;
background: $secondary-50;
  }
  
  
  .modal-header {
border-bottom: 1px solid $secondary-500;
display: flex;
justify-content: space-between;
padding: 22px 14px;
  }
  </style>
