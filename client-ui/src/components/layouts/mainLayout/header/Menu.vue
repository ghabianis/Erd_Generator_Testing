<template>
  <!--begin::Menu wrapper-->
  <div
    class="header-menu align-items-stretch"
    data-kt-drawer="true"
    data-kt-drawer-name="header-menu"
    data-kt-drawer-activate="{default: true, lg: false}"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="{default:'200px', '300px': '250px'}"
    data-kt-drawer-direction="end"
    data-kt-drawer-toggle="#kt_header_menu_mobile_toggle"
    data-kt-place="true"
    data-kt-place-mode="prepend"
    data-kt-place-parent="{default: '#kt_body', lg: '#kt_header_nav'}"
  >
    <!--begin::Menu-->
    <div
      class="menu menu-lg-rounded menu-column menu-lg-row menu-state-bg menu-title-gray-700 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-400 fw-bold my-5 my-lg-0 align-items-stretch"
      id="#kt_header_menu"
      data-kt-menu="true"
    >
      <template v-for="(item, i) in DocMenuConfig" :key="i">
        <template v-if="!item.heading">
          <template v-for="(menuItem, j) in item.pages" :key="j">
            <div v-if="menuItem.heading" class="menu-item me-lg-1">
              <router-link
                :to="menuItem.route"
                v-slot="{ href, navigate, isActive, isExactActive }"
              >
                <a
                  :href="href"
                  class="menu-link py-3 mb-0"
                  @click="navigate"
                  :class="[isActive && 'active', isExactActive && 'active']"
                >
                  <span
                    class="menu-title"
                    :data-test="
                      'headerMenu' + menuItem.heading.replace(/\s+/g, '')
                    "
                    >{{ menuItem.heading }}</span
                  >
                </a>
              </router-link>
            </div>
          </template>
        </template>

        <div
          v-if="item.heading"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-start"
          class="menu-item menu-lg-down-accordion me-lg-1"
        >
          <span
            class="menu-link py-3"
            :class="{ active: hasActiveChildren(item.route) }"
          >
            <span
              class="menu-title"
              :data-test="'headerMenu' + item.heading.replace(/\s+/g, '')"
              >{{ item.heading }}</span
            >
            <span class="menu-arrow d-lg-none"></span>
          </span>
          <div
            class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-rounded-0 py-lg-4 w-lg-225px"
          >
            <template v-for="(menuItem, j) in item.pages" :key="j">
              <div
                v-if="menuItem.sectionTitle"
                data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                data-kt-menu-placement="right-start"
                class="menu-item menu-lg-down-accordion"
              >
                <span
                  class="menu-link py-3"
                  :class="{ active: hasActiveChildren(menuItem.route) }"
                >
                  <span class="menu-icon">
                    <i
                      v-if="headerMenuIcons === 'font'"
                      :class="menuItem.fontIcon"
                      class="bi fs-3"
                    ></i>
                    <span
                      v-if="headerMenuIcons === 'svg'"
                      class="svg-icon svg-icon-2"
                    >
                      <inline-svg :src="menuItem.svgIcon" />
                    </span>
                  </span>
                  <span class="menu-title">{{
                    $t(menuItem.sectionTitle)
                  }}</span>
                  <span class="menu-arrow"></span>
                </span>
                <div
                  class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-active-bg py-lg-4 w-lg-225px"
                >
                  <!-- BEGIN ELEMENTS RECENTS -->
                  <template v-for="(menuItem1, k) in menuItem.sub" :key="k">
                    <div
                      v-if="menuItem1.sectionTitle"
                      data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                      data-kt-menu-placement="right-start"
                      class="menu-item menu-lg-down-accordion"
                    >
                      <span
                        class="menu-link py-3"
                        :class="{ active: hasActiveChildren(menuItem1.route) }"
                      >
                        <span class="menu-bullet">
                          <span class="bullet bullet-dot"></span>
                        </span>
                        <span class="menu-title">{{
                          $t(menuItem1.sectionTitle)
                        }}</span>
                        <span class="menu-arrow"></span>
                      </span>
                      <div
                        class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-active-bg py-lg-4 w-lg-225px"
                      >
                        <template
                          v-for="(menuItem2, l) in menuItem1.sub"
                          :key="l"
                        >
                          <div class="menu-item">
                            <router-link
                              class="menu-link py-3"
                              active-class="active"
                              :to="menuItem2.route"
                            >
                              <span class="menu-bullet">
                                <span class="bullet bullet-dot"></span>
                              </span>
                              <span class="menu-title">{{
                                $t(menuItem2.heading)
                              }}</span>
                            </router-link>
                          </div>
                        </template>
                      </div>
                    </div>
                    <div
                      v-if="menuItem1.heading && platforms"
                      class="menu-item"
                    >
                      <router-link
                        class="menu-link py-3"
                        v-for="(platform, index) in platforms"
                        :key="index"
                        :to="{
                          name: 'platform-overview',
                          params: { id: platform.id },
                        }"
                      >
                        <span class="menu-bullet">
                          <span class="bullet bullet-dot"></span>
                        </span>
                        <span class="menu-title">{{ platform.name }}</span>
                      </router-link>
                    </div>
                  </template>
                  <!-- END ELEMENTS RECENTS -->
                </div>
              </div>
              <div
                v-if="menuItem.heading && !menuItem.modalName"
                class="menu-item"
              >
                <router-link class="menu-link py-3" :to="menuItem.route">
                  <span class="menu-icon">
                    <span class="svg-icon svg-icon-2">
                      <inline-svg :src="menuItem.svgIcon" />
                    </span>
                  </span>
                  <span
                    class="menu-title"
                    :data-test="
                      'headerMenu' + menuItem.heading.replace(/\s+/g, '')
                    "
                    >{{ menuItem.heading }}</span
                  >
                </router-link>
              </div>
              <div
                v-if="menuItem.heading && menuItem.modalName"
                class="menu-item"
              >
                <p
                  class="menu-link py-3 mb-0"
                  @click="setModal(menuItem.modalName)"
                >
                  <span class="menu-icon">
                    <span class="svg-icon svg-icon-2">
                      <inline-svg :src="menuItem.svgIcon" />
                    </span>
                  </span>
                  <span class="menu-title">{{ menuItem.heading }}</span>
                </p>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
  <!--end::Menu wrapper-->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { MenuComponent } from "@/assets/ts/components";
import useDocMenuConfig from "@/core/config/MainMenuConfig";
import { headerMenuIcons } from "@/core/helpers/config";
import { storeToRefs } from "pinia";
import { useBodyStore } from "@/store/useBodyModule";

// import { setModal } from "@/core/helpers/config";

export default defineComponent({
  name: "KTMenu",
  components: {},
  setup() {
    const route = useRoute();
    const { isLoading } = storeToRefs(useBodyStore());
    const DocMenuConfig = useDocMenuConfig();

    let platforms = ref();

    const user = computed(() => {
      return;
    });

    const hasActiveChildren = (match: any) => {
      isLoading.value = true;
      return route.path.indexOf(match) !== -1;
    };

    onMounted(() => {
      MenuComponent.reinitialization();
    });
    return {
      hasActiveChildren,
      headerMenuIcons,
      DocMenuConfig,
      platforms,
      // setModal,
    };
  },
});
</script>
