<template>
  <div class="block">

    <div>
     <p>Pagination</p> 
     <el-avatar :shape="shape" :size="size" />
      <Pagination
          :itemsPerPage="5"
          :set-items-per-page="5"
          :page="Math.floor(5) + 1"
          :current-page-change="1"
          :total="20"
          :pages-array="[3, 6, 9, 12]"
        />
    </div>
   
    <div>
      <p>Avatar</p> 
      <el-avatar :shape="shape" :size="size" />
      <Avatar first-name="Emma" last-name="Smith" />
   
    </div>  

     <div>
      <p>Loader</p>
      <el-avatar :shape="shape" :size="size" />
       <KTLoader :logo="loaderLogo"></KTLoader> 
    </div>

    <div>
      <p>NotificationsMenu</p>
      <el-avatar :shape="shape" :size="size" />
       <NotificationsMenu /> 
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KTLoader from "@/components/shared/Loader.vue";
import Pagination from "@/components/shared/pagination/Pagination.vue";
import { DfAvatar } from "@tekab-dev-team/storybook-devfactory";
import NotificationsMenu from "@/components/shared/NotificationsMenu.vue";

import {
  loaderLogo,
} from "@/core/helpers/config";

export default defineComponent({
  props: {
    shape: {
      type: String,
      default: "square",
    },
    size: {
      type: Number,
      default: 40,
    }
  },
  name: "doc",
   components: {
  
    KTLoader,
    loaderLogo,
    Pagination,
    Avatar: DfAvatar,
    NotificationsMenu
  },
  setup() {
    return 
    { 

    };
  },
});
</script>

<style scoped>
.block {
  display: flex;
  flex-direction: column;
}

.block > div  {
  margin: 6px;
  color:brown
}
</style>
