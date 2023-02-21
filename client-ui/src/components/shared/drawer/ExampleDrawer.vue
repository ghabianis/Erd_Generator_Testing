<template>
    <!--begin::Modal - New Target-->
    <DrawerLayoutVue max-width="100%" id="survey-followed" :title="'Drawer Title'" :close-function="closeModal">
      <template #header-right-content><el-icon :size="30"><Clock/></el-icon></template>
      <template #body>Make your Content here ...</template>
    </DrawerLayoutVue>
    <!--end::Modal - New Target-->
  </template>
    
  <script lang="ts" setup>
  import { ref } from "vue";
  import DrawerLayoutVue from "../../modals/DrawerLayout.vue";
  import { setDrawer } from "@/core/helpers/config";
  
    const props = defineProps ({
      payload: {
        type: Object,
        required: true,
      },
    });
      const loading = ref<boolean>(false);
  
      const closeModal = () => {
        setDrawer("");
      };
  </script>
  <style lang="scss" scoped>
  .last-sondage {
    padding: 0 10px;
    margin: 15px 0;
  
    hr {
      color: #cccecf;
    }
  }
  </style>
    