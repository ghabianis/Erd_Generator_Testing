<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <avatar shape="circle" 
          :first-name="currentUser?.firstName ?? currentUser?.user_metadata?.firstName"
          :last-name="currentUser?.lastName ?? currentUser?.user_metadata?.lastName"/>
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="d-flex flex-column">
          <div class="fw-bolder d-flex align-items-center fs-5">
             {{
              (currentUser?.firstName ?? currentUser?.user_metadata?.firstName) +
              " " +
              (currentUser?.lastName ?? currentUser?.user_metadata?.lastName)
            }}
            <span
              class="badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2"
              >Pro</span
            >
          </div>
          <router-link to="#" class="fw-bold text-muted text-hover-primary fs-7"
            >{{ currentUser?.username ?? currentUser?.user_metadata?.username }}</router-link
          >
        </div>
        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <router-link :to="{ name: 'my-profile' }" class="menu-link px-5">
        My Profile
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <router-link to="/pages/profile/overview" class="menu-link px-5">
        <span class="menu-text">My Platforms</span>
        <span class="menu-badge">
          <span class="badge badge-light-danger badge-circle fw-bolder fs-7"
            >3</span
          >
        </span>
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div
      class="menu-item px-5"
      data-kt-menu-trigger="hover"
      data-kt-menu-placement="left-start"
      data-kt-menu-flip="center, top"
    >
      <router-link to="/pages/profile/overview" class="menu-link px-5">
        <span class="menu-title">My Subscription</span>
        <span class="menu-arrow"></span>
      </router-link>

      <!--begin::Menu sub-->
      <div class="menu-sub menu-sub-dropdown w-175px py-4">
        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <router-link to="/pages/profile/overview" class="menu-link px-5">
            Referrals
          </router-link>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <router-link to="/pages/profile/overview" class="menu-link px-5">
            Billing
          </router-link>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <router-link to="/pages/profile/overview" class="menu-link px-5">
            Payments
          </router-link>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <router-link
            to="/pages/profile/overview"
            class="menu-link d-flex flex-stack px-5"
          >
            Statements

            <i
              class="fas fa-exclamation-circle ms-2 fs-7"
              data-bs-toggle="tooltip"
              title="View your statements"
            ></i>
          </router-link>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu separator-->
        <div class="separator my-2"></div>
        <!--end::Menu separator-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <div class="menu-content px-3">
            <label
              class="form-check form-switch form-check-custom form-check-solid"
            >
              <input
                class="form-check-input w-30px h-20px"
                type="checkbox"
                value="1"
                checked
                name="notifications"
              />
              <span class="form-check-label text-muted fs-7">
                Notifications
              </span>
            </label>
          </div>
        </div>
        <!--end::Menu item-->
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <router-link to="/pages/profile/overview" class="menu-link px-5">
        My Statements
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div
      class="menu-item px-5"
      data-kt-menu-trigger="hover"
      data-kt-menu-placement="left-start"
      data-kt-menu-flip="center, top"
    >
      <router-link to="#" class="menu-link px-5">
        <span class="menu-title position-relative">
          Language
          <span
            class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0"
          >
            {{ currentLanguageLocale.name }}
            <img
              class="w-15px h-15px rounded-1 ms-2"
              :src="'/' + currentLanguageLocale.flag"
              alt="metronic"
            />
          </span>
        </span>
      </router-link>

      <!--begin::Menu sub-->
      <div class="menu-sub menu-sub-dropdown w-175px py-4">
        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a
            @click="setLang('en')"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage('en') }"
          >
            <span class="symbol symbol-20px me-4">
              <img
                class="rounded-1"
                src="/svg/flags/united-states.svg"
                alt="metronic"
              />
            </span>
            English
          </a>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a
            @click="setLang('fr')"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage('fr') }"
          >
            <span class="symbol symbol-20px me-4">
              <img
                class="rounded-1"
                src="/svg/flags/france.svg"
                alt="metronic"
              />
            </span>
            French
          </a>
        </div>
        <!--end::Menu item-->
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5 my-1">
      <router-link to="/pages/profile/overview" class="menu-link px-5">
        Account Settings
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5"> Sign Out </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
// import { setLogin } from "@/core/helpers/user";
import { DfAvatar } from "@tekab-dev-team/storybook-devfactory";
import { useAuthStore } from "@/store/useAuth";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "kt-user-menu",
  components: { Avatar: DfAvatar },
  setup() {
    const authStore = useAuthStore();
    const { currentUser } = storeToRefs(useAuthStore());
    const router = useRouter();
    const i18n = useI18n();

    i18n.locale.value = localStorage.getItem("lang")
      ? (localStorage.getItem("lang") as string)
      : "fr";
    const countries = {
      en: {
        flag: "svg/flags/united-states.svg",
        name: "English",
      },
      fr: {
        flag: "svg/flags/france.svg",
        name: "French",
      },
    };

    const signOut = () => {
      authStore.logout();
    };

    const setLang = (lang: string) => {
      localStorage.setItem("lang", lang);
      i18n.locale.value = lang;
    };

    const currentLanguage = (lang: string) => {
      return i18n.locale.value === lang;
    };

    const currentLanguageLocale = computed(() => {
      return countries[i18n.locale.value];
    });

    return {
      signOut,
      setLang,
      currentLanguage,
      currentLanguageLocale,
      currentUser,
    };
  },
});
</script>
