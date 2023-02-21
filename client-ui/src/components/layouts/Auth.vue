<template>
  <!--begin::Content-->
  <div>
    <router-view></router-view>
  </div>
  <!--end::Content-->
</template>

<script lang="ts">
// import { useBodyStore } from "@/store/useBodyModule";
import { defineComponent, onMounted, onUnmounted } from "vue";

export default defineComponent({
  name: "auth",
  components: {},
  setup() {
    // const { addBodyClassName, removeBodyClassName } = useBodyStore();

    // onMounted(() => {
    //   addBodyClassName("bg-body");
    // });

    // onUnmounted(() => {
    //   removeBodyClassName("bg-body");
    // });
  },
});
</script>