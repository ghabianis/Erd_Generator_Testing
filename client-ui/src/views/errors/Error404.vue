<template>
  <div class="d-flex flex-column flex-center flex-column-fluid p-10">
    <!--begin::Illustration-->
    <el-image src="/svg/error/404.svg" alt="" class="mw-100 mb-10 h-lg-450px" />
    <!--end::Illustration-->

    <!--begin::Message-->
    <h1 class="fw-bold mb-10" style="color: #a3a3c7">
      {{ t("error404.message") }}
    </h1>
    <!--end::Message-->

    <!--begin::Link-->
    <router-link :to="{ name: 'home' }" exact class="btn btn-primary">{{
      t("error404.returnHome")
    }}</router-link>
    <!--end::Link-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { t } from "@/core/i18n/translate";

export default defineComponent({
  name: "error-404",
  components: {},
  setup() {
    return { t };
  },
});
</script>
