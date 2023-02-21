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
      <el-card class="card">
        <div class="card-body p-lg-9">
          <h1 class="d-flex justify-content-center fw-bolder">
            {{ t("msgResetPasswordInterface.title") }}
          </h1>
          <div class="d-flex justify-content-center text-center mt-4">
            <h4 class="text-gray-400 fw-bold">
              {{ t("msgResetPasswordInterface.msg") }}
            </h4>
          </div>
          <div class="mt-lg-8 d-flex justify-content-center">
            <router-link :to="{ name: 'sign-in' }">
              <el-button type="primary" size="large">
                {{ t("signIn") }}
              </el-button>
            </router-link>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script lang="ts">
import { t } from "@/core/i18n/translate";
import { defineComponent } from "vue";

export default defineComponent({
  name: "msg-reset-password",
  setup() {
    return { t };
  },
});
</script>
