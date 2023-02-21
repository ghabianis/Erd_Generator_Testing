<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column w-250px w-lg-325px"
    data-kt-menu="true"
  >
    <!--begin::Heading-->
    <div
      class="d-flex flex-column flex-center bgi-no-repeat rounded-top px-9 py-10"
      style="background-image: url('jpg/patterns/pattern-1.jpg')"
    >
      <!--begin::Title-->
      <h3 class="text-white fw-bold mb-3">administration DevFactory</h3>
      <!--end::Title-->

      <!--begin::Status-->
      <span class="badge bg-success py-2 px-3">25 pending tasks</span>
      <!--end::Status-->
    </div>
    <!--end::Heading-->

    <!--begin:Nav-->
    <div class="row g-0">
      <!--begin:Item-->
      <div class="col-6">
        <!-- <PanelAdminLink
          :to="{ name: 'all-platforms' }"
          :description="'Pending Tasks'"
          :title="$t('platforms')"
          :src="'svg/admin-dropdown/platform.svg'"
          :disabled="true"
        /> -->
      </div>
      <!--end:Item-->
      <!--begin:Item-->
      <div class="col-6">
        <!-- <PanelAdminLink
          :to="{ name: '' }"
          :description="'20 tickets en cours'"
          :title="$t('tickets')"
          :src="'svg/admin-dropdown/ticket.svg'"
          :disabled="true"
        /> -->
      </div>

      <!--end:Item-->

      <!--begin:Item-->
      <!-- <div class="col-6">
        <PanelAdminLink
          :to="{ name: 'users-management' }"
          :description="`30 ${$t('users')}`"
          :title="$t('usersManagement')"
          :src="'svg/icons/user.svg'"
        />
      </div> -->
      <!--end:Item-->

      <!--begin:Item-->
      <div class="col-6">
        <!-- <PanelAdminLink
          :to="{ name: '' }"
          :description="`${$t('system')}`"
          :title="$t('system')"
          :src="'svg/admin-dropdown/system.svg'"
          :disabled="true"
        /> -->
      </div>
      <!--end:Item-->
    </div>
    <!--end:Nav-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import PanelAdminLink from "@/components/shared/PanelAdminLink.vue";

export default defineComponent({
  name: "kt-quick-links-menu",
  // components: { PanelAdminLink },
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped>
a.disabled {
  pointer-events: none;
  cursor: default;
}
</style>
