<template>
  <div
    class="d-flex align-items-center justify-content-center"
    style="height: 100vh"
  >
    <!--Illustration-->
    <div class="d-flex bg-login">
      <div
        class="bgi-no-repeat bgi-position-x-center bgi-size bgi-position-center min-h-200px min-h-xl-600px mb-xl-10 test3 square2"
        style="
          background-image: url('/svg/authentication/login-ellipse-icon.svg');
          position: absolute;
          top: -14%;
          left: -14%;
          width: 42%;
          transform: rotate(180deg);
          z-index: -1;
        "
      />
      <div
        class="bgi-no-repeat bgi-position-x-center bgi-size bgi-position-center min-h-200px min-h-xl-600px mb-xl-10 test3 square2"
        style="
          background-image: url('/svg/authentication/admin-registre-icon.svg');
          position: absolute;
          top: 0%;
          left: 0%;
          width: 22%;
          z-index: -1;
        "
      />
      <div
        class="bgi-no-repeat bgi-position-x-center bgi-size bgi-position-center min-h-200px min-h-xl-600px mb-xl-10 test3 square2"
        style="
          background-image: url('/svg/authentication/login-ellipse-icon.svg');
          position: absolute;
          bottom: 0%;
          right: 0%;
          width: 45%;
          z-index: -1;
        "
      />
      <div
        class="bgi-no-repeat bgi-position-x-center bgi-size bgi-position-center min-h-200px min-h-xl-500px mb-xl-10 test3 w-25"
        style="
          background-image: url('/svg/authentication/member-registre-icon.svg');
          z-index: 1;
          position: absolute;
          bottom: 0;
          right: 0%;
        "
      ></div>
    </div>
    <!-- end Illustration-->
    <div class="w-lg-500px mb-10 mb-lg-3 mx-auto d-flex flex-column">
      <img alt="Logo" src="/svg/logos/logo.svg" class="h-60px mb-lg-10" />
      <el-form ref="formRef" class="form" :model="form" :rules="rules">
        <el-card class="card">
          <div class="card-body p-lg-9">
            <h1 class="d-flex justify-content-center fw-bolder">
              {{ t("signUpInterface.title") }}
            </h1>
            <div class="d-flex justify-content-center">
              <h4 class="text-gray-400 fw-bold">
                {{ t("alreadyHaveAnAccount") }}?
                <router-link
                  data-test="signInFormLoginLink"
                  :to="{ name: 'sign-in' }"
                  class="fw-bolder"
                >
                  {{ t("signInRedirection") }}
                </router-link>
              </h4>
            </div>
            <div class="mt-lg-5">
              <el-form-item prop="email">
                <label class="form-label fw-bolder text-gray-900 fs-6">{{
                  t("email")
                }}</label>
                <el-input
                  size="large"
                  type="email"
                  v-model="form.email"
                  data-test="signUpFormEmail"
                />
              </el-form-item>
            </div>

            <div class="mt-lg-5">
              <el-form-item prop="password">
                <label class="form-label fw-bolder text-gray-900 fs-6">{{
                  t("password")
                }}</label>
                <el-input
                  type="password"
                  size="large"
                  v-model="form.password"
                  data-test="signUpFormPassword"
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
                  data-test="signUpFormConfirmPassword"
                  show-password
                />
              </el-form-item>
            </div>

            <div class="mt-lg-5">
              <el-form-item prop="firstName">
                <label class="form-label fw-bolder text-gray-900 fs-6">{{
                  t("firstName")
                }}</label>
                <el-input
                  size="large"
                  type="text"
                  v-model="form.firstName"
                  data-test="signUpFormFirstName"
                />
              </el-form-item>
            </div>

            <div class="mt-lg-5">
              <el-form-item prop="lastName">
                <label class="form-label fw-bolder text-gray-900 fs-6">{{
                  t("lastName")
                }}</label>
                <el-input
                  size="large"
                  type="text"
                  v-model="form.lastName"
                  data-test="signUpFormLastName"
                />
              </el-form-item>
            </div>

            <div class="mt-lg-5">
              <el-form-item prop="role">
                <label class="form-label fw-bolder text-gray-900 fs-6">{{
                  t("role")
                }}</label>
                <el-select
                  class="w-100"
                  v-model="form.role"
                  size="large"
                  placeholder="Choisir role"
                  style="width: auto"
                  data-test="signUpFormRole"
                >
                  <el-option
                    v-for="item in roles"
                    :data-test="'signInFormRole_' + item.label"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </div>

            <div class="mt-lg-5 d-grid">
              <el-button
                data-test="signUpSubmitButton"
                @click="onSubmit(formRef)"
                :loading="isLoading"
                type="primary"
                size="large"
                class="mt-2"
                >{{ t("signUp") }}</el-button
              >
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
import { defineComponent, ref } from "vue";
import type { ElForm } from "element-plus";

let failMessage: string | null;
let wrongConfirmPwdMsg: string | null;
let shortPwdMsg: string | null;
const roles = [
  {
    value: "user",
    label: "User",
  },
  {
    value: "admin",
    label: "Admin",
    disabled: true,
  },
];
export default defineComponent({
  name: "sign-up",
  setup() {
    failMessage = t("messages.signUpFailed");
    wrongConfirmPwdMsg = t("messages.wrongConfirmPassword");
    shortPwdMsg = t("messages.shortPassword");
    const authStore = useAuthStore();
    const isLoading = ref<boolean>(false);

    const form = ref({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "user",
    });
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
      firstName: [
        {
          required: true,
          message: t("entityForm.validation.required"),
          trigger: "blur",
        },
      ],
      lastName: [
        {
          required: true,
          message: t("entityForm.validation.required"),
          trigger: "blur",
        },
      ],
    });
    const signUp = async () => {
      try {
        isLoading.value = true;
        await authStore.signUp(
          form.value.email,
          form.value.password,
          form.value.firstName,
          form.value.lastName,
          form.value.role
        );
        isLoading.value = false;
      } catch (error) {
        Components.ElMessage.error(failMessage);
        console.log(error);
        isLoading.value = false;
      }
    };

    const onSubmit = async (
      formEl: InstanceType<typeof ElForm> | undefined
    ) => {
      if (!formEl) return;
      formEl.validate(async (valid) => {
        if (valid) {
          await signUp();
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
      roles,
      authStore,
      onSubmit,
      isLoading,
    };
  },
});
</script>
