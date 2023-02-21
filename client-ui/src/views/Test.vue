<template>
    <div>
      <el-tabs class="p-10 m-20 border border-white" type="card" tabPosition="left">
        <el-tab-pane label="Drawer">
          <button class="el-primary mx-5" @click="openExampleDrawer">open Drawer</button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from "vue";
  import DrawerLayout from "@/components/modals/DrawerLayout.vue";
  import { setDrawer } from "@/core/helpers/config";

      const shareDialogVisible = ref(false);
      const shareSocialMediaDialogVisible = ref(false)

      const openExampleDrawer = () => {
        setDrawer("ExampleDrawer")
      }
  </script>
  
  <style lang="scss" scoped>
  :deep(.el-dialog) {
    --el-dialog-bg-color: #181a1f !important;
    --el-dialog-width: 50%;
  }
  //display the modal for the mobile large 425px
  @media (max-width: 500px) {
    :deep(.el-dialog) {
      --el-dialog-width: 50%;
    }
  }
  
  //display the modal for the tablet large 600px
  @media (min-width: 600px) {
    :deep(.el-dialog) {
      --el-dialog-width: 50%;
    }
  }
  //display the modal for the laptpop 970px
  @media (min-width: 970px) {
    :deep(.el-dialog) {
      --el-dialog-width: 30%;
    }
  }
  
  :deep(.el-tabs__item:not(.is-active)) {
    color: $primary-100;
  }
  :deep(.el-tabs:not(.is-active)) {
    background-color: $info-100;
    height: 65vh;
  }
  </style>
  