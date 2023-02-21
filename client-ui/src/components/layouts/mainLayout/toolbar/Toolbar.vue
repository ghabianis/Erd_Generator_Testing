<template>
  <!--begin::Toolbar-->
  <div class="toolbar" id="kt_toolbar">
    <!--begin::Container-->
    <div
      id="kt_toolbar_container"
      :class="{
        'container-fluid': toolbarWidthFluid,
      }"
      class="d-flex flex-stack mx-4"
    >
      <!--begin::Page title-->
      <div
        data-kt-swapper="true"
        data-kt-swapper-mode="prepend"
        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
        class="page-title d-flex align-items-center flex-wrap me-3 mb-5 mb-lg-0"
      >
        <!--begin::Title-->
        <h1 class="d-flex align-items-center text-dark fw-bolder my-1 fs-3">
          {{ title }}
        </h1>
        <!--end::Title-->

        <span
          v-if="breadcrumbs"
          class="h-20px border-gray-200 border-start mx-4"
        ></span>

        <!--begin::Breadcrumb-->
        <ul
          v-if="breadcrumbs"
          class="breadcrumb breadcrumb-separatorless fw-bold fs-7 my-1"
        >
          <li class="breadcrumb-item pe-3">
            <router-link
              :to="{ name: 'home' }"
              class="text-muted text-hover-primary"
            >
              Home
            </router-link>
          </li>
          <li class="breadcrumb-item">
            <span class="bullet bg-gray-200 w-5px h-2px"></span>
          </li>
          <template v-for="(item, index) in breadcrumbs" :key="index">
            <li class="breadcrumb-item text-muted">
              {{ item }}
            </li>
            <li class="breadcrumb-item">
              <span class="bullet bg-gray-200 w-5px h-2px"></span>
            </li>
          </template>
          <li class="breadcrumb-item pe-3 text-dark">
            {{ title }}
          </li>
        </ul>
        <!--end::Breadcrumb-->
      </div>
      <!--end::Page title-->

      <!--begin::Actions-->
      <!-- <div class="d-flex align-items-center py-1">
     
        <button
          class="btn btn-sm btn-primary"
          @click="handleChangeStateModal"
          v-if="displayButton"
        >
          Create Ticket
        </button>
        <button
          class="btn btn-sm btn-primary"
          @click="displayModalPlatform"
          v-else
        >
          Create Platforme
        </button>
      
      </div> -->
      <!--end::Actions-->
    </div>
    <!--end::Container-->
  </div>
  <!--end::Toolbar-->
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { toolbarWidthFluid } from "@/core/helpers/config";
// import { setModal } from "@/core/helpers/config";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "KToolbar",
  props: {
    breadcrumbs: Array,
    title: String,
  },
  components: {},
  setup() {
    const handleChangeStateModal = () => {
      // setModal("KTCreateNewTicket");
      console.log("handleChangeStateModal");
    };
    const displayModalPlatform = () => {
      // setModal("KTCreatePlatformModal");
      console.log("KTCreatePlatformModal");
    };
    const router = useRouter();
    const displayButton = computed(() => {
      const pathName = router.currentRoute.value.path.split("/")[1];
      return pathName === "platform";
    });
    return {
      toolbarWidthFluid,
      displayButton,
      handleChangeStateModal,
      displayModalPlatform,
    };
  },
});
</script>
<style lang="scss">
@media (min-width: 992px) {
  .toolbar {
    left: 0px !important;
  }
}
</style>
