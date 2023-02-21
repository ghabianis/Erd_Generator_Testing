<template>
  <transition name="fade" mode="default">
    <component
      v-if="drawerState.type !== ''"
      :is="drawerState.type"
      :payload="drawerState.payload"
    ></component>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useConfigStore } from "@/store/useConfig";
import { storeToRefs } from "pinia";

//Modals
import ExampleDrawer from "./drawer/ExampleDrawer.vue";
export default defineComponent({
  components: {
    ExampleDrawer
  },
  setup() {
    const { drawerState } = storeToRefs(useConfigStore());

    return { drawerState };
  },
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-active,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active,
.fade-enter-to {
  opacity: 1;
}
</style>
