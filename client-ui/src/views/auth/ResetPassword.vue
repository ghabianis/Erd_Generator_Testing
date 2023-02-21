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
      <img alt="Logo" src="/svg/logos/logo.svg" class="h-60px mb-lg-5" />
      <el-form ref="formRef" class="form" :model="form" :rules="rules">
        <el-card class="card">
          <div class="card-body p-lg-9">
            <h1 class="d-flex justify-content-center fw-bolder">
              {{ t("resetPasswordInterface.title") }}
            </h1>
            <div class="d-flex justify-content-center text-center">
              <h4 class="text-gray-400 fw-bold">
                {{ t("resetPasswordInterface.msg") }}
              </h4>
            </div>

            <div class="mt-lg-10">
              <el-form-item prop="password">
                <label class="form-label fw-bolder text-gray-900 fs-6">{{
                  t("newPassword")
                }}</label>
                <el-input
                  type="password"
                  size="large"
                  v-model="form.password"
                  data-test="resetPasswordFormPassword"
                  show-password
                />
              </el-form-item>
            </div>
            <div class="mt-lg-5">
              <el-form-item prop="confirmPassword">
                <label class="form-label fw-bolder text-gray-900 fs-6">{{
                  t("confirmPassword")
                }}</label>
                <el-input
                  type="password"
                  size="large"
                  v-model="form.confirmPassword"
                  data-test="resetPasswordFormConfirmPassword"
                  show-password
                />
              </el-form-item>
            </div>
            <div class="d-flex flex-wrap justify-content-center pt-lg-10">
              <el-button
                data-test="resetPasswordSubmitButton"
                @click="onSubmit(formRef)"
                size="large"
                type="primary"
                class="fw-bolder me-2"
              >
                {{ t("submit") }}
              </el-button>
              <router-link
                data-test="resetPasswordCancelLink"
                :to="{ name: 'sign-in' }"
                class="el-button el-button--large is-plain el-button--primary fw-bolder"
                >{{ t("cancel") }}</router-link
              >
            </div>
          </div>
        </el-card>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
import { ref, defineComponent } from "vue";
import { Components } from "@tekab-dev-team/storybook-devfactory";

import type { ElForm } from "element-plus";

let wrongConfirmPwdMsg: string | null;
let shortPwdMsg: string | null;
export default defineComponent({
  name: "password-reset",
  setup() {
    wrongConfirmPwdMsg = t("messages.wrongConfirmPassword");
    shortPwdMsg = t("messages.shortPassword");
    const authStore = useAuthStore();

    const form = ref({ password: "", confirmPassword: "" });
    const formRef = ref<InstanceType<typeof ElForm>>();
    const validateConfirmPassword = (rule: any, value: any, callback: any) => {
      if (value !== form.value.password) {
        callback(
          new Error(
            wrongConfirmPwdMsg ??
              "Password and Confirm password are not the same"
          )
        );
      } else {
        callback();
      }
    };
    const rules = ref({
      password: [
        {
          required: true,
          message: t("entityForm.validation.required"),
          trigger: "blur",
        },
        {
          min: 8,
          message: shortPwdMsg ?? "Length should be at least 8 characters",
          trigger: "blur",
        },
      ],
      confirmPassword: [
        {
          required: true,
          message: t("entityForm.validation.required"),
          trigger: "blur",
        },
        {
          validator: validateConfirmPassword,
          trigger: "blur",
        },
      ],
    });

    const resetPassword = async () => {
      await authStore.reset(form.value.password);
    };

    const onSubmit = async (
      formEl: InstanceType<typeof ElForm> | undefined
    ) => {
      if (!formEl) return;
      formEl.validate(async (valid) => {
        if (valid) {
          await resetPassword();
        } else {
          console.log("error submit!");
          return false;
        }
      });
    };
    return {
      t,
      form,
      formRef,
      rules,
      authStore,
      onSubmit,
    };
  },
});
</script>
