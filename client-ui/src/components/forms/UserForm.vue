<template>
  <el-form :model="user" label-width="120px" :rules="rules" ref="ruleFormRef">
    <el-form-item label="firstName" prop="firstName">
      <el-input v-model="user.firstName" data-test="userFormfirstName" />
    </el-form-item>
    <el-form-item label="lastName" prop="lastName">
      <el-input v-model="user.lastName" data-test="userFormlastName" />
    </el-form-item>
    <el-form-item label="username" prop="username">
      <el-input v-model="user.username" data-test="userFormusername" />
    </el-form-item>
    <el-form-item label="isValid" prop="isValid">
      <el-switch v-model="user.isValid" data-test="userFormisValid" />
    </el-form-item>
    <el-form-item label="roles" prop="roles">
      <el-input v-model="user.roles" data-test="userFormroles" />
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button
        data-test="userFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="userFormSubmitButton"
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

import { useUserStore } from "@/store/useUserModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";

const props = defineProps({
  isEdit: { type: Boolean, default: false },
});

const { user, error } = storeToRefs(useUserStore());
const { getUserById, createUser, editUser, resetUser } = useUserStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  firstName: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  lastName: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  username: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  isValid: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  roles: [
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
    return await editUser({ id });
  } else await createUser();
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
        router.push({ name: "list-user" });
        resetUser();
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
  resetUser();
};
const getCurrentUser = async (id: string) => {
  if (props.isEdit) {
    await getUserById(id);
  }
};

onMounted(async () => {
  const id = route.params.id as string;

  await getCurrentUser(id);
});
</script>
