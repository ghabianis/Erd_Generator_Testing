<template>
  <div class="mx-auto py-5 ms-4 me-4 h-100 w-100 cards">
    <div style="width: 900px; height: 640px">
      <UserInfo />
    </div>
    <div style="width: 520px; height: 640px">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div v-for="o in 9" :key="o" class="text item">
          {{ "List item " + o }}
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import UserInfo from "@/components/shared/userProfile/UserInfo.vue";

export default defineComponent({
  setup() {
    return {};
  },
  components: { UserInfo },
});
</script>

<style lang="scss" scoped>
.card-header {
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}

.cards {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 30px 20px;
  gap: 20px;

  position: absolute;
  left: 142px;
  top: 80px;
}
</style>
