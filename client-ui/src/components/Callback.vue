<template>
  <div>
    <h1>Hello User, Welcome on Home Page</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "home",
  components: {},
  setup() {
    //@ts-ignore
    const app_url = import.meta.env.VITE_REDIRECT_EXPO_URL;
    let newUrl = new URL(app_url);
    let x = "?" + window.location.hash.slice(1);
    newUrl.search = x;
    // console.log({ newUrl, x });
    window.location.href = newUrl.href;
  },
});
</script>
