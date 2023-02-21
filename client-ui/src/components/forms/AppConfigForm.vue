<template>
  <el-form
    :model="appconfig"
    label-width="120px"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="value" prop="value">
      <el-input v-model="appconfig.value" data-test="appconfigFormvalue" />
    </el-form-item>
    <el-form-item label="key" prop="key">
      <el-input v-model="appconfig.key" data-test="appconfigFormkey" />
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button
        data-test="appconfigFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="appconfigFormSubmitButton"
        type="primary"
        @click="onSubmit(ruleFormRef)"
        >Create</el-button
      >
    </div>
  </el-form>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { supabase } from "@/core/services/SupabaseClientService";

import { useAppConfigStore } from "@/store/useAppConfigModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";

const props = defineProps({
  isEdit: { type: Boolean, default: false },
});

const { appconfig, error } = storeToRefs(useAppConfigStore());
const {
  getAppConfigById,
  createAppConfig,
  editAppConfig,
  resetAppConfig,
} = useAppConfigStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  value: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  key: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
});

const handleSubmitForm = async () => {
  isLoading.value = true;
  if (props.isEdit) {
    const id = route?.params?.id as string;
    return await editAppConfig({ id });
  } else await createAppConfig();
};

const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      await handleSubmitForm();
      if (!!error.value) {
        Components.ElMessage.error(error.value?.message);
        console.log(error, "error");
      } else {
        router.push({ name: "list-appconfig" });
        resetAppConfig();
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
const resetForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  resetAppConfig();
};
const getCurrentAppConfig = async (id: string) => {
  if (props.isEdit) {
    await getAppConfigById(id);
  }
};

onMounted(async () => {
  const id = route.params.id as string;

  await getCurrentAppConfig(id);
});
</script>
