<template>
  <div
    class="d-flex align-items-center justify-content-center"
    style="height: 100vh"
  >
    <!--Illustration-->
    <div class="d-flex bg-login">
      <div
        class="bgi-no-repeat bgi-position-x-center bgi-size bgi-position-center min-h-200px min-h-xl-500px mb-xl-10 test3 w-25"
        style="
          background-image: url('/svg/authentication/login-geolocation-icon.svg');
          z-index: 1;
          position: absolute;
          bottom: 0%;
          left: 0%;
        "
      ></div>
      <div
        class="bgi-no-repeat bgi-position-x-center bgi-size bgi-position-center min-h-200px min-h-xl-500px mb-xl-10 test3 w-25"
        style="
          background-image: url('/svg/authentication/login-community-icon.svg');
          position: absolute;
          bottom: 0%;
          right: 0%;
          z-index: -1;
        "
      ></div>
      <div
        class="bgi-no-repeat bgi-position-x-end bgi-size bgi-position-y-bottom min-h-200px min-h-xl-400px mb-xl-10 test4"
        style="
          background-image: url('/svg/authentication/login-polygon-icon.svg');
          position: absolute;
          bottom: 0;
          width: 22%;
          left: 60%;
          z-index: -1;
        "
      ></div>
      <div
        class="bgi-no-repeat bgi-position-x-center bgi-size bgi-position-center min-h-200px min-h-xl-600px mb-xl-10 test3 square2"
        style="
          background-image: url('/svg/authentication/login-ellipse-icon.svg');
          position: absolute;
          bottom: 0%;
          left: 14%;
          width: 45%;
          z-index: -2;
        "
      ></div>
    </div>
    <!-- end Illustration-->
    <div class="w-lg-500px mb-10 mb-lg-3 mx-auto d-flex flex-column">
      <img alt="Logo" src="/svg/logos/logo.svg" class="h-60px mb-lg-20" />
      <el-form ref="formRef" class="form" :model="form" :rules="rules">
        <el-card class="card">
          <div class="card-body p-lg-9">
            <h1 class="d-flex justify-content-center fw-bolder">
              {{ t("login.title") }}
            </h1>
            <div class="d-flex justify-content-center mt-5">
              <h4 class="text-gray-400 fw-bold">
                {{ t("login.newHere") }}?
                <router-link
                  data-test="signInFormRegisterLink"
                  :to="{ name: 'sign-up' }"
                  class="fw-bolder"
                  >{{ t("login.register") }}</router-link
                >
              </h4>
            </div>
            <div class="mt-lg-10">
              <el-form-item prop="email">
                <label class="form-label fw-bolder text-gray-900 fs-6">
                  {{ t("email") }}</label
                >
                <el-input
                  size="large"
                  type="email"
                  v-model="form.email"
                  data-test="signInFormEmail"
                />
              </el-form-item>
            </div>
            <div class="mt-lg-8">
              <div class="row justify-content-between form-label">
                <div class="col-6 text-start fw-bolder text-gray-900 fs-6">
                  {{ t("password") }}
                </div>
                <div class="col-6 text-end">
                  <router-link
                    data-test="signInFormForgotPasswordLink"
                    :to="{ name: 'email-reset-password' }"
                    >{{ t("forgotPassword") }} ?</router-link
                  >
                </div>
              </div>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  size="large"
                  v-model="form.password"
                  data-test="signInFormPassword"
                  show-password
                />
              </el-form-item>
            </div>
            <div class="mt-lg-10 d-grid">
              <el-button
                data-test="signInSubmitButton"
                @click="onSubmit(formRef)"
                :loading="isLoading"
                type="primary"
                size="large"
                class="btn-lg mt-2"
                >{{ t("signIn") }}</el-button
              >
            </div>
            <div class="mt-6 d-flex align-items-center justify-content-between">
              <div class="line"></div>
              <span style="color: #7239ea; font-size: 16px">{{
                $t("login.or")
              }}</span>
              <div class="line"></div>
            </div>
            <div class="d-flex p-6 justify-content-center">
              <el-button
                v-for="provider in providers"
                :data-test="'signInWith' + provider.provider + 'Button'"
                :key="provider.provider"
                @click="loginWithProvider(provider.provider)"
                class="card provider_card d-flex align-items-center justify-content-center"
                ><inline-svg :src="provider.logo" />
              </el-button>
            </div>
          </div>
        </el-card>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
import { ref, defineComponent } from "vue";

import type { ElForm } from "element-plus";

let failMessage: string | null;

export default defineComponent({
  name: "sign-in",
  setup() {
    failMessage = t("messages.loginFailed");
    const authStore = useAuthStore();

    const isLoading = ref<boolean>(false);
    const form = ref({ email: "", password: "" });
    const formRef = ref<InstanceType<typeof ElForm>>();
    const rules = ref({
      email: [
        {
          required: true,
          message: t("entityForm.validation.required"),
          trigger: "blur",
        },
        {
          type: "email",
          message: "Please input correct email address",
          trigger: ["blur", "change"],
        },
      ],
      password: [
        {
          required: true,
          message: t("entityForm.validation.required"),
          trigger: "blur",
        },
      ],
    });
    const providers = ref([
      { logo: "/svg/socialMediaLogos/google.svg", provider: "google" },
      { logo: "/svg/socialMediaLogos/linkedin.svg", provider: "linkedin" },
      { logo: "/svg/login/logo_github.svg", provider: "github" },
    ]);
    const loginWithProvider = async (Provider: any) => {
      try {
        await authStore.loginWithProvider(Provider);
      } catch (error) {
        console.log(error);
        Components.ElMessage.error(failMessage);
      }
    };

    const login = async () => {
      isLoading.value = true;
      try {
        await authStore.login(form.value.email, form.value.password);
        isLoading.value = false;
      } catch (error) {
        Components.ElMessage.error(failMessage);
        isLoading.value = false;
      }
    };

    const onSubmit = async (
      formEl: InstanceType<typeof ElForm> | undefined
    ) => {
      if (!formEl) return;
      formEl.validate(async (valid) => {
        if (valid) {
          await login();
        } else {
          console.log("error submit!");
          return false;
        }
      });
    };
    return {
      t,
      form,
      onSubmit,
      isLoading,
      rules,
      formRef,
      loginWithProvider,
      providers,
    };
  },
});
</script>
<style lang="scss" scoped>
.el-input {
  background-color: #e9ecef;
}
:deep(.el-input__inner) {
  width: 100%;
}
@media (max-width: 1200px) {
  .bg-login {
    display: none !important;
  }
}
.provider_card {
  height: 50px;
  width: 50px;
  background: rgba(255, 255, 255, 0.11) !important;
}
.logo {
  cursor: pointer;
}

.line {
  border-top: 1px solid #7239ea;
  width: 45%;
}
</style>
