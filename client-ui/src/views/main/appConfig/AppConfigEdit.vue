<template>
  <div
    class="col-12 col-md-8 mx-auto mt-4 border border-secondary p-5 bg-white"
  >
    <h3 class="text-center text-primary my-4">Edit AppConfig</h3>
    <AppConfigForm isEdit />
  </div>
</template>
<script lang="ts" setup>
import AppConfigForm from "@/components/forms/AppConfigForm.vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/config";
import { onMounted } from "vue";
onMounted(() => {
  setCurrentPageBreadcrumbs("Edit appconfig", ["appconfigs"]);
});
</script>
