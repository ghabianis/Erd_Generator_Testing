<template>
  <!--begin::Card body-->
  <el-card>
    <div class="card-body">
      <!--begin::Card title-->
      <div
        class="card-title mb-6"
        style="
          border-bottom: 1px solid #a9b1e2;
          height: 55px;
          display: flex;
          align-items: center;
          padding-left: 25px;
        "
      >
        <h3 class="fw-bold m-0">Info Utilisateur</h3>
      </div>
      <!--end::Card title-->
      <div style="padding: 15px 25px 0px 25px">
        <div class="avatar_container">
          <!-- Avatar -->
          <Avatar
            :size="120"
            shape="square"
            :src="profilePicture"
            :first-name="
              currentUser?.firstName ?? currentUser?.user_metadata?.firstName
            "
            :last-name="
              currentUser?.lastName ?? currentUser?.user_metadata?.lastName
            "
          />
          <!--begin::Label-->
          <label
            class="btn btn-icon btn-square btn-active-color-primary w-25px h-25px shadow editAvatarBtn"
          >
            <inline-svg src="/svg/icons/pencil-square.svg" />

            <!--begin::Inputs-->
            <input
              type="file"
              name="avatar"
              accept=".png, .jpg, .jpeg"
              style="display: none"
              @change="handleEditProfilePicture"
            />

            <!--end::Inputs-->
          </label>
          <!--end::Label-->
          <!-- End Avatar -->
        </div>

        <!--begin::Username-->
        <div class="d-flex flex-wrap align-items-center mb-8 mt-4">
          <div
            id="kt_signin_username"
            :class="{ 'd-none': userNameFormDisplay }"
          >
            <div class="fs-4 fw-bolder mb-1">Nom et prénom</div>
            <div class="fs-6 fw-semobold text-gray-600">
              {{
                (currentUser?.firstName ??
                  currentUser?.user_metadata?.firstName) +
                " " +
                (currentUser?.lastName ?? currentUser?.user_metadata?.lastName)
              }}
            </div>
          </div>

          <UsernameEdit
            :userNameFormDisplay="userNameFormDisplay"
            @cancel="cancel('userNameFormDisplay')"
          />
          <div
            id="kt_signin_username_button"
            :class="{ 'd-none': userNameFormDisplay }"
            class="ms-auto"
          >
            <el-button @click="userNameFormDisplay = true" class="btn-update">
              Mise à jour nom et prénom
            </el-button>
          </div>
        </div>
        <!--end::Username-->

        <!--begin::Email Address-->
        <div class="d-flex flex-wrap align-items-center mb-8">
          <div id="kt_signin_email" :class="{ 'd-none': emailFormDisplay }">
            <div class="fs-4 fw-bolder mb-1">Email Address</div>
            <div class="fs-6 fw-semobold text-gray-600">
              {{
                currentUser?.username ?? currentUser?.user_metadata?.username
              }}
            </div>
          </div>

          <EmailEdit
            :emailFormDisplay="emailFormDisplay"
            @cancel="cancel('emailFormDisplay')"
          />

          <div
            id="kt_signin_email_button"
            :class="{ 'd-none': emailFormDisplay }"
            class="ms-auto"
          >
            <el-button @click="emailFormDisplay = true" class="btn-update">
              Mise à jour email
            </el-button>
          </div>
        </div>
        <!--end::Email Address-->

        <!--begin::Password-->
        <div class="d-flex flex-wrap align-items-center mb-8">
          <div
            id="kt_signin_password"
            :class="{ 'd-none': passwordFormDisplay }"
          >
            <div class="fs-4 fw-bolder mb-1">Mot de passe</div>
            <div class="fs-6 fw-semobold text-gray-600">************</div>
          </div>
          <PasswordEdit
            :passwordFormDisplay="passwordFormDisplay"
            @cancel="cancel('passwordFormDisplay')"
          />
          <div
            id="kt_signin_password_button"
            class="ms-auto"
            :class="{ 'd-none': passwordFormDisplay }"
          >
            <el-button @click="passwordFormDisplay = true" class="btn-update">
              Mise à jour mot de passe
            </el-button>
          </div>
          <!--end::Password-->
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import UsernameEdit from "./UsernameEdit.vue";
import EmailEdit from "./EmailEdit.vue";
import PasswordEdit from "./PasswordEdit.vue";

import { DfAvatar } from "@tekab-dev-team/storybook-devfactory";
import { useAuthStore } from "@/store/useAuth";
import { storeToRefs } from "pinia";

export default defineComponent({
  setup() {
    const { currentUser } = storeToRefs(useAuthStore());
    const emailFormDisplay = ref(false);
    const userNameFormDisplay = ref(false);
    const updateEmailButton = ref<HTMLElement | null>(null);
    const passwordFormDisplay = ref(false);
    const profilePicture = ref("");
    onMounted(() => {
      // get user password and update password ref
    });
    const cancel = (id: any) => {
      switch (id) {
        case "passwordFormDisplay":
          passwordFormDisplay.value = false;
          break;
        case "userNameFormDisplay":
          userNameFormDisplay.value = false;
          break;
        case "emailFormDisplay":
          emailFormDisplay.value = false;
          break;
        default:
          console.log(`Sorry, we are out of ${id}.`);
      }
    };

    const updateEmail = () => {
      if (updateEmailButton.value) {
        // Activate indicator
        updateEmailButton.value.setAttribute("data-kt-indicator", "on");
        setTimeout(() => {
          updateEmailButton.value?.removeAttribute("data-kt-indicator");
          emailFormDisplay.value = false;
        }, 2000);
      }
    };
    const handleEditProfilePicture = async (event: any) => {
      profilePicture.value = URL.createObjectURL(event.target.files[0]);
      // handle profile picture change
    };
    return {
      emailFormDisplay,
      updateEmailButton,
      updateEmail,
      passwordFormDisplay,
      userNameFormDisplay,
      cancel,
      currentUser,
      profilePicture,
      handleEditProfilePicture,
    };
  },
  components: { Avatar: DfAvatar, UsernameEdit, EmailEdit, PasswordEdit },
});
</script>

<style lang="scss" scoped>
.editAvatarBtn {
  background: #535a87;
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
}
.avatar_container {
  position: relative;
  width: fit-content;
}
.card-body {
  background: white;
  max-height: 650px;
  min-height: 500px;
  overflow: auto;
}
.btn-update {
  :deep() {
    color: $primary-500;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }
}
.el-button:hover {
  background: $primary-50;
  border-color: $primary-500;
}
.card-body {
  padding: 0;
}
:deep(.el-card__body) {
  padding: 0;
}
</style>
