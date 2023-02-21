<template>
  <transition
    name="fade"
    mode="default"
  >
    <component
      :is="modalState.type"
      v-if="modalState.type !== ''"
      :payload="modalState.payload"
      :show-modal="modalState.type !== ''"
      @close-modal="setModal('')"
    />
  </transition>
</template>

<script lang="ts">
import { setModal } from '@/core/helpers/config'

import { defineComponent } from 'vue'
import { useConfigStore } from '@/store/useConfig'
import { storeToRefs } from 'pinia'
// Modals

export default defineComponent({
  components: {
  },
  setup () {
    const { modalState } = storeToRefs(useConfigStore())
    return { modalState, setModal }
  }
})
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
