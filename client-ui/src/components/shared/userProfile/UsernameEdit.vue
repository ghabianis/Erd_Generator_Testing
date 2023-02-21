<template>
  <div
    id="kt_signin_username_edit"
    :class="{ 'd-none': !userNameFormDisplay }"
    class="flex-row-fluid"
  >
    <!--begin::Form-->
    <el-form
      id="kt_signin_change_username"
      class="form"
      novalidate="novalidate"
      :rules="rules"
      :model="form"
      ref="formRef"
    >
      <div class="row mb-6">
        <div class="col-lg-6 mb-4 mb-lg-0">
          <div class="fv-row mb-0">
            <el-form-item prop="lastName">
              <label for="lastname" class="form-label fs-6 fw-bold mb-3"
                >Nom</label
              >
              <el-input
                type="text"
                id="last-name"
                placeholder=""
                name="lastname"
                v-model="form.lastName"
                size="large"
              />
            </el-form-item>
          </div>
        </div>
        <div class="col-lg-6 mb-4 mb-lg-0">
          <div class="fv-row mb-0">
            <el-form-item prop="firstName">
              <label for="firstname" class="form-label fs-6 fw-bold mb-3"
                >Prénom</label
              >
              <el-input
                type="text"
                id="first-name"
                placeholder=""
                name="firstname"
                v-model="form.firstName"
                size="large"
              />
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="d-flex">
        <el-button
          id="kt_username_submit"
          type="primary"
          class="submit-btn"
          @click="updateUsername(formRef)"
        >
          <span class="indicator-label"> Mise à jour nom et prénom </span>
        </el-button>
        <el-button
          id="kt_username_cancel"
          @click="resetForm(formRef)"
          class="cancel-btn"
        >
          Annuler
        </el-button>
      </div>
    </el-form>
    <!--end::Form-->
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { useAuthStore } from "@/store/useAuth";
import { useUserStore } from "@/store/useUserModule";
import { storeToRefs } from "pinia";
import { t } from "@/core/i18n/translate";
import type { ElForm } from "element-plus";
import { supabase } from "@/core/services/SupabaseClientService";

export default defineComponent({
  emits: ["cancel"],
  props: {
    userNameFormDisplay: {
      required: true,
    },
  },
  setup(props, { emit }) {
    const { currentUser } = storeToRefs(useAuthStore());
    const { error } = storeToRefs(useUserStore());
    const { editUser } = useUserStore();
    const form = ref({ firstName: "", lastName: "" });
    const formRef = ref<InstanceType<typeof ElForm>>();
    const rules = ref({
      firstName: [
        {
          required: true,
          message: `${t("entityForm.validation.required")}`,
          trigger: "blur",
        },
        {
          min: 3,
          message: "Length should be min 3",
          trigger: "blur",
        },
      ],
      lastName: [
        {
          required: true,
          message: `${t("entityForm.validation.required")}`,
          trigger: "blur",
        },
        {
          min: 3,
          message: "Length should be min 3",
          trigger: "blur",
        },
      ],
    });
    onMounted(() => {
      form.value.firstName =
        currentUser?.value.firstName ??
        currentUser?.value.user_metadata?.firstName;
      form.value.lastName =
        currentUser?.value.lastName ??
        currentUser?.value.user_metadata?.lastName;
    });
    const updateUsername = async (
      formEl: InstanceType<typeof ElForm> | undefined
    ) => {
      if (!formEl) return;
      formEl.validate(async (valid) => {
        if (valid) {
          let payload = {
            data: {
              firstName: form.value.firstName,
              lastName: form.value.lastName,
            },
            id: currentUser.value.id,
          };
          await editUser(payload);
            if (!error.value) {
            await supabase.auth.update({
              data: {
                firstName: form.value.firstName,
              lastName: form.value.lastName,
              },
            });
            currentUser.value.user_metadata.firstName = form.value.firstName;
            currentUser.value.user_metadata.lastName = form.value.lastName;
            emit("cancel");
          } else {
            Components.ElMessage.error(error.value?.message);
          }
        } else {
          console.log("error submit!");
          return false;
        }
      });
    };
    const resetForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
      if (!formEl) return;
      form.value = {
        firstName:
          currentUser?.value.firstName ??
          currentUser?.value.user_metadata?.firstName,
        lastName:
          currentUser?.value.lastName ??
          currentUser?.value.user_metadata?.lastName,
      };
      formEl.resetFields();
      emit("cancel");
    };
    return { updateUsername, currentUser, formRef, form, rules, resetForm };
  },
  components: {},
});
</script>

<style lang="scss" scoped>
.el-input {
  :deep(input) {
    background-color: #e9ecef;
    border-color: #e9ecef;
    color: #5e6278;
  }
}

.submit-btn {
  background: $primary-500;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 20px;

  :deep(span) {
    color: #ffffff;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }
}
.cancel-btn {
  border: 1px solid $primary-500;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  :deep(span) {
    color: $primary-500;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }
}

.cancel-btn:hover {
  background: $primary-50;
  border-color: $primary-500;
}
.submit-btn:hover {
  background: $primary-800;
}
</style>
