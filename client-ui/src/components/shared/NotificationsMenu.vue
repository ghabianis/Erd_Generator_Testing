<template>
  <!--begin::Menu-->
  <div>
    <!--begin::Tab-->

    <el-tabs
      v-bind="args"
      v-model="activeName"
      @tab-click="handleClick"
      data-test="notificationMenu"
    >
      <!--begin::Tab panel-->

      <el-tab-pane label="Notifications" name="first" data-test="notificationMenuNotifications"
        ><div
          class="tab-pane fade show"
          id="kt_topbar_notifications_1"
          role="tabpanel"
        >
          <!--begin::Items-->
          <div class="scroll-y mh-325px my-5 px-8">
            <template v-for="(item, index) in data2" :key="index">
              <!--begin::Item-->
              <div class="d-flex flex-stack py-4">
                <!--begin::Section-->
                <div class="d-flex me-2">
                  <!--begin::Code-->
                  <!-- <span
                  class="w-70px badge me-4"
                  :class="`badge-light-${item.state}`"
                  >{{ item.code }}</span
                > -->
                  <div class="notif__ic w-45px h-35px">
                    <inline-svg :src="`${item.icon}`" />
                  </div>
                  <!--end::Code-->

                  <!--begin::Title-->
                  <div class="notif_info d-flex flex-column align-items-start">
                    <a
                      href="#"
                      class="text-gray-800 text-hover-primary fw-bold"
                      >{{ item.title }}</a
                    >
                    <!--begin::Label-->
                    <span class="badge-light fs-8">{{ item.time }}</span>
                    <!--end::Label-->
                  </div>
                  <!--end::Title-->
                </div>
                <!--end::Section-->
              </div>
              <!--end::Item-->
            </template>
          </div>

          <div class="py-3 text-center border-top">
            <a href="#" class="btn btn-color-gray-600 btn-active-color-primary">
              View All
              <span class="svg-icon-svg-icon-5">
                <inline-svg src="svg/icons/arr064.svg" />
              </span>
            </a>
          </div>
        </div>
      </el-tab-pane>

      <!--end::Tab panel-->

      <!--begin::Tab panel-->

      <el-tab-pane label="Envoyer" name="second" data-test="NotificationMenuEnvoyer"
        ><div
          class="tab-pane fade show"
          id="kt_topbar_notifications_2"
          role="tabpanel"
        >
          <!--begin::Wrapper-->
          <div class="d-flex flex-column px-9">
            <!--begin::Section-->
            <div class="pt-10 pb-0">
              <!--begin::Action-->
              <div class="text-center mb-9 w-100"></div>
              <!--end::Action-->

              <!--begin::Items-->
              <div class="scroll-y mh-325px my-5">
                <template v-for="(item, index) in notifData" :key="index">
                  <!--begin::Item-->
                  <div class="d-flex flex-stack justify-content-between py-4">
                    <div class="d-flex flex-column align-items-start">
                      <h6>{{ item.title }}</h6>
                      <span class="badge-light fs-8">{{
                        item.description
                      }}</span>
                      <div>
                        <span class="badge-light fs-7 fw-bold"
                          >{{ $dayjs(item.sendDate).format("D-MM-YYYY") }}
                        </span>
                        <span
                          class="w-70px badge me-4 mx-3"
                          :class="`badge-light-${
                            item.status == 'Programmed' ? 'primary' : 'success'
                          }`"
                          >{{ item.status }}</span
                        >
                      </div>
                    </div>
                    <div class="d-flex flex-column mx-3">
                      <inline-svg
                        class="mb-3 cursor-pointer"
                        @click="editNotif(item.id)"
                        src="/svg/navbar/dropdown/notifDropdown/edit-notif.svg"
                      />
                      <inline-svg
                        class="cursor-pointer"
                        @click="deleteNotif(item.id)"
                        src="/svg/navbar/dropdown/notifDropdown/delete-notif.svg"
                      />
                    </div>
                  </div>
                  <!--end::Item-->
                </template>
              </div>
              <!--end::Items-->
            </div>
            <!--end::Section-->
          </div>
          <!--end::Wrapper-->
        </div>
      </el-tab-pane>

      <!--end::Tab panel-->
    </el-tabs>

    <!--end::Tab-->
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { setModal } from "@/core/helpers/config";
import type { TabsPaneContext } from "element-plus";

export default defineComponent({
  name: "notifications-menu",
  components: {},
  inject: ["$dayjs"],
  setup() {
    const activeName = ref("first");
    const notifData = ref([
      {
        createdAt: "2022-10-05T15:52:02.17",
        deletedAt: null,
        id: "1",
        updatedAt: "2022-10-05T15:52:06.474",
        title: "Notification 1",
        status: "Programmed",
        description: "Notification 1 Description",
        sendDate: null,
      },
      {
        createdAt: "2022-10-05T15:52:02.17",
        deletedAt: null,
        id: "2",
        updatedAt: "2022-10-05T15:52:06.481",
        title: "Notification 2",
        status: "Sent",
        description: "Notification 2 Description",
        sendDate: "2022-10-05T15:52:02.17",
      },
      {
        createdAt: "2022-10-05T15:52:02.17",
        deletedAt: null,
        id: "3",
        updatedAt: "2022-10-05T15:52:06.485",
        title: "Notification 3",
        status: "Sent",
        description: "Notification 3 Description",
        sendDate: "2022-10-05T15:52:02.17",
      },
      {
        createdAt: "2022-10-05T15:52:02.17",
        deletedAt: null,
        id: "4",
        updatedAt: "2022-10-05T15:52:06.488",
        title: "Notification 4",
        status: "Programmed",
        description: "Notification 4 Description",
        sendDate: "2022-10-05T15:52:02.17",
      },
      {
        createdAt: "2022-10-05T15:52:02.17",
        deletedAt: null,
        id: "5",
        updatedAt: "2022-10-05T15:52:06.492",
        title: "Notification 5",
        status: "Programmed",
        description: "Notification 5 Description",
        sendDate: "2022-10-05T15:52:02.17",
      },
      {
        createdAt: "2022-10-05T15:52:02.17",
        deletedAt: null,
        id: "6,",
        updatedAt: "2022-10-05T15:52:06.495",
        title: "Notification 6",
        status: "Sent",
        description: "Notification 6 Description",
        sendDate: "2022-10-05T15:52:02.17",
      },
    ]);

    const openModal = () => {
      setModal("NotificationMenuModalVue");
    };
    const handleClick = (tab: TabsPaneContext, event: Event) => {
      console.log(tab, event);
    };

    const data2 = [
      {
        title: "Notification pour sondage",
        icon: "/svg/navbar/dropdown/notifDropdown/sond-notif.svg",
        message: "New order",
        time: "Just now",
      },
      {
        title: "Notification pour carte cadeaux",
        icon: "/svg/navbar/dropdown/notifDropdown/carte-cadeau.svg",
        message: "New customer",
        time: "2 hrs",
      },
      {
        title: "Notification pour jeux concour",
        icon: "/svg/navbar/dropdown/notifDropdown/quiz-notif.svg",
        message: "Payment process",
        time: "5 hrs",
      },
      {
        title: "Notification pour support",
        icon: "/svg/navbar/dropdown/notifDropdown/supp-notif.svg",
        message: "Search query",
        time: "2 days",
      },
      {
        title: "Notification pour support",
        icon: "/svg/navbar/dropdown/notifDropdown/supp-notif.svg",
        message: "API connection",
        time: "1 week",
      },
      {
        title: "Notification pour carte cadeaux",
        icon: "/svg/navbar/dropdown/notifDropdown/carte-cadeau.svg",
        message: "Database restore",
        time: "Mar 5",
      },
    ];

    const args = {
      editable: false,
      "tab-position": "top",
      stretch: "true",
      closable: false,
      addable: false,
      lazy: false,
    };

    const deleteNotif = async (id: string) => {};

    const editNotif = (id: string) => {
      setModal("EditNotificationModalVue", id);
    };
    return {
      args,
      data2,
      openModal,
      activeName,
      handleClick,
      notifData,
      deleteNotif,
      editNotif,
    };
  },
});
</script>

<style lang="scss" scoped>
.nav-item {
  width: 50%;
  text-align: center;
  .nav-link {
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 14px;
    color: #5e6278;
  }
  .nav-link.active {
    color: #2544dd;
  }
  &:first-child {
    .nav-link {
      margin-right: 0.5;
    }
  }
  &:last-child {
    .nav-link {
      margin-left: 0.5;
    }
  }
}
.custombtn {
  border: 1px solid #2544dd !important;
  width: 100%;
}
</style>
