<template>
  <!--begin::Aside-->
  <div
    id="kt_aside"
    class="aside aside-hoverable aside-light mobile-nav"
    data-kt-drawer="true"
    data-kt-drawer-name="aside"
    data-kt-drawer-activate="{default: true, lg: false}"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="{default:'200px', '300px': '250px'}"
    data-kt-drawer-direction="start"
    data-kt-drawer-toggle="#kt_aside_mobile_toggle"
  >
    <!--begin::Aside menu-->
    <div class="aside-menu flex-column-fluid">
      <KTMenu></KTMenu>
    </div>
    <!--end::Aside menu-->

    <!--begin::Footer-->
    <div
      class="aside-footer flex-column-auto pt-5 pb-7 px-20"
      id="kt_aside_footer"
    >
      <KTUserMenu></KTUserMenu>
    </div>
    <!--end::Footer-->
  </div>
  <!--end::Aside-->
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated } from "vue";

import { ToggleComponent } from "@/assets/ts/components/_ToggleComponent";
import KTMenu from "@/components/layouts/mainLayout/aside/Menu.vue";
import KTUserMenu from "@/components/layouts/mainLayout/header/partials/UserMenu.vue";

export default defineComponent({
  name: "KTAside",
  components: {
    KTMenu,
    KTUserMenu,
  },
  props: {
    lightLogo: String,
  },
  setup() {
    onMounted(() => {
      ToggleComponent.reinitialization();
    });

    onUpdated(() => {
      ToggleComponent.bootstrap();
    });

    return {};
  },
});
</script>

<style lang="scss" scoped>
@media (min-width: 992px) {
  .mobile-nav {
    width: 0 !important;
  }
}
</style>
