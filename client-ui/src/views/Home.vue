<template>
  <h1>Hello User, Welcome on Home Page</h1>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { resetPageBreadcrumbs } from "@/core/helpers/config";

export default defineComponent({
  name: "home",
  components: {},
  setup() {
    onMounted(async () => {
    resetPageBreadcrumbs();
    });
  },
});
</script>
