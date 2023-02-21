<template>
  <Teleport to="body">
    <el-dialog
      v-model="isOpenModal"
      data-test="confirmModal"
      :title="title"
      :show-close="false"
      :width="`${modalWidth}%`"
    >
      <slot></slot>
      <template #footer>
        <span class="dialog-footer">
          <el-button data-test="ConfirmModalCancelButton" @click="$emit('close-confirm-modal')">Cancel</el-button>
          <el-button
            data-test="ConfirmModalConfirmButton" 
            type="primary"
            :loading="isLoading"
            @click="$emit('approve-confirm-modal')"
            >Confirm</el-button
          >
        </span>
      </template>
    </el-dialog>
  </Teleport>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from "vue";

const props = defineProps({
  isOpenModal: Boolean,
  isLoading: Boolean,
  title: String,
});
defineEmits(["close-confirm-modal", "approve-confirm-modal"]);
const modalWidth = ref(window.innerWidth < 768 ? 90 : 40);
const resizeHandler = () => {
  if (window.innerWidth < 768) return (modalWidth.value = 90);
  else modalWidth.value = 40;
};

onMounted(() => {
  window.addEventListener("resize", resizeHandler);
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeHandler);
});
</script>
<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
