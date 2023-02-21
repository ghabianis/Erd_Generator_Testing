<template>
  <!--begin::Toolbar wrapper-->
  <div class="d-flex align-items-stretch flex-shrink-0">
    <!--begin::Activities-->
    <div class="d-flex align-items-center ms-1 ms-lg-3">
      <!--begin::drawer toggle-->
      <div
        class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
        id="kt_activities_toggle"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="/svg/icons/gen032.svg" />
        </span>
      </div>
      <!--end::drawer toggle-->
    </div>
    <!--end::Activities-->
    <!--begin::Chat-->
    <div class="d-flex align-items-center ms-1 ms-lg-3">
      <!--begin::Menu wrapper-->
      <div
        class="btn btn-icon btn-active-light-primary position-relative w-30px h-30px w-md-40px h-md-40px"
        id="kt_drawer_chat_toggle"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="/svg/icons/com012.svg" />
        </span>

        <span
          class="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink"
        ></span>
      </div>
      <!--end::Menu wrapper-->
    </div>
    <!--end::Chat-->
    <!--begin::Notifications-->

    <div class="d-flex align-items-center ms-1 ms-lg-3">
      <!--begin::Menu-->
      <div
        class="btn btn-icon btn-active-light-primary position-relative w-30px h-30px w-md-40px h-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        data-kt-menu-flip="bottom"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="/svg/icons/gen022.svg" />
        </span>
      </div>
      <KTNotificationsMenu></KTNotificationsMenu>
      <!--end::Menu-->
    </div>
    <!--end::Notifications-->
    <!--begin::Quick links-->
    <div class="d-flex align-items-center ms-1 ms-lg-3">
      <!--begin::Menu-->
      <div
        class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        data-kt-menu-flip="bottom"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="/svg/icons/gen025.svg" />
        </span>
      </div>
      <KTQuickLinksMenu></KTQuickLinksMenu>
      <!--end::Menu-->
    </div>
    <!--end::Quick links-->

    <!--begin::User-->
    <div class="d-flex align-items-center ms-1 ms-lg-3" id="kt_header_user_menu_toggle">
      <!--begin::Menu-->
      <div
        class="cursor-pointer symbol symbol-30px symbol-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        data-kt-menu-flip="bottom"
      >
        <Avatar
          :first-name="currentUser?.firstName ?? currentUser?.user_metadata?.firstName"
          :last-name="currentUser?.lastName ?? currentUser?.user_metadata?.lastName"
          shape="square"
        />
      </div>
      <KTUserMenu></KTUserMenu>
      <!--end::Menu-->
    </div>
    <!--end::User -->
  </div>
  <!--end::Toolbar wrapper-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KTNotificationsMenu from "@/components/layouts/mainLayout/header/partials/NotificationsMenu.vue";
import KTQuickLinksMenu from "@/components/layouts/mainLayout/header/partials/QuickLinksMenu.vue";
import KTUserMenu from "@/components/layouts/mainLayout/header/partials/UserMenu.vue";
import { DfAvatar } from "@tekab-dev-team/storybook-devfactory";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/useAuth";

export default defineComponent({
  name: "topbar",
  components: {
    KTNotificationsMenu,
    KTQuickLinksMenu,
    KTUserMenu,
    Avatar: DfAvatar,
  },
  setup() {
    const { currentUser } = storeToRefs(useAuthStore());
    return {
      currentUser,
    };
  },
});
</script>
