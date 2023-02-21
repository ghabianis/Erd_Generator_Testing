<template>
  <!--begin::Header-->
  <div id="kt_header" class="header align-items-stretch start-0">
    <!--begin::Container-->
    <div
      :class="{
        'container-fluid': headerWidthFluid,
        'container-xxl': !headerWidthFluid,
      }"
      class="d-flex align-items-stretch justify-content-between mx-4"
    >
      <!--begin::Aside mobile toggle-->
      <div class="d-flex align-items-center d-lg-none ms-n3 me-1" title="Show aside menu">
        <div class="btn btn-icon btn-active-light-primary btn-nav" id="kt_aside_mobile_toggle">
          <span class="svg-icon svg-icon-2x mt-1"  data-test="asideMenuMobileToggleBtn">
            <inline-svg src="/svg/icons/abs015.svg" />
          </span>
        </div>
        <div class="d-flex align-items-stretch flex-shrink-0 btn-nav">
          <KTLogo></KTLogo>
        </div>
      </div>
      <!--end::Aside mobile toggle-->

      <!--begin::Wrapper-->
      <div class="d-flex align-items-stretch justify-content-between flex-lg-grow-1">
        <slot>
          <router-view />
        </slot>
        <!--end::Topbar-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Container-->
  </div>
  <!--end::Header-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KTLogo from "@/components/layouts/mainLayout/header/Logo.vue";
import { headerWidthFluid } from "@/core/helpers/config";



export default defineComponent({
  name: "KTHeader",
  props: {
    title: String,
  },
  components: {
    KTLogo,
  },
  setup() {
    return {
      headerWidthFluid
    };
  },
});
</script>
<style lang="scss" scoped>
.btn-nav {
  margin-right: 10px !important;
}
@media (max-width: 992px) {
  .logo-nav {
    display: none !important;
  }
}
</style>
