<template>
  <div
    id="kt_signin_password_edit"
    class="flex-row-fluid"
    :class="{ 'd-none': !passwordFormDisplay }"
  >
    <div class="fs-6 fw-semobold text-gray-600 mb-4">
      Le mot de passe doit comporter au moins 8 caracères et contenir des
      symboles
    </div>

    <!--begin::Form-->
    <el-form
      id="kt_signin_change_password"
      ref="formRef"
      class="form"
      novalidate="novalidate"
      :rules="rules"
      :model="form"
    >
      <div class="row mb-6">
        <div class="col-lg-4">
          <div class="fv-row mb-0">
            <el-form-item prop="oldPassword">
              <label
                for="currentpassword"
                class="form-label fs-6 fw-bold mb-3"
              >Mot de passe actuel</label>
              <el-input
                id="currentpassword"
                v-model="form.oldPassword"
                type="password"
                name="currentpassword"
                size="large"
                show-password
              />
            </el-form-item>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="fv-row mb-0">
            <el-form-item prop="newPassword">
              <label
                for="newpassword"
                class="form-label fs-6 fw-bold mb-3"
              >Nouveau mot de passe</label>
              <el-input
                id="newpassword"
                v-model="form.newPassword"
                type="password"
                name="newpassword"
                size="large"
                show-password
              />
            </el-form-item>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="fv-row mb-0">
            <el-form-item prop="confirmNewPassword">
              <label
                for="confirmpassword"
                class="form-label fs-6 fw-bold mb-3"
              >Confirmer le nouveau mot de passe</label>
              <el-input
                id="confirmpassword"
                v-model="form.confirmNewPassword"
                type="password"
                name="confirmpassword"
                size="large"
                show-password
              />
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="d-flex">
        <el-button
          id="kt_password_submit"
          ref="updatePasswordButton"
          type="primary"
          class="submit-btn"
          @click="submitForm(formRef)"
        >
          <span class="indicator-label"> Mise à jour mot de passe </span>
        </el-button>
        <el-button
          id="kt_password_cancel"
          class="cancel-btn"
          @click="resetForm(formRef)"
        >
          Annuler
        </el-button>
      </div>
    </el-form>
    <!--end::Form-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { t } from '@/core/i18n/translate'
import type { FormInstance } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/useAuth'
import { Components } from '@tekab-dev-team/storybook-devfactory'
import { supabase } from '@/core/services/SupabaseClientService'
import service from '@/service'

export default defineComponent({
  components: {},
  props: {
    passwordFormDisplay: {
      required: true
    }
  },
  emits: ['cancel'],
  setup (props, { emit }) {
    const { currentUser } = storeToRefs(useAuthStore())
    const form = ref({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    })
    const formRef = ref<FormInstance>()
    const validateConfirmPassword = (rule: any, value: any, callback: any) => {
      if (value !== form.value.newPassword) {
        callback(new Error('Password and Confirm password are different'))
      } else {
        callback()
      }
    }
    const rules = ref({
      oldPassword: [
        {
          required: true,
          message: `${t('entityForm.validation.required')}`,
          trigger: 'blur'
        }
      ],
      newPassword: [
        {
          required: true,
          message: `${t('entityForm.validation.required')}`,
          trigger: 'blur'
        },
        {
          min: 8,
          message: 'Length should be min 8',
          trigger: 'blur'
        }
      ],
      confirmNewPassword: [
        {
          required: true,
          message: `${t('entityForm.validation.required')}`,
          trigger: 'blur'
        },
        {
          validator: validateConfirmPassword,
          trigger: 'blur'
        }
      ]
    })

    const submitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          const payload = {
            id: currentUser.value.id,
            data: {
              password: form.value.oldPassword,
              newPassword: form.value.newPassword
            }
          }
          try {
            await service.api.userControllerUpdatePassword(payload.id, payload.data)
            await supabase.auth.update({
              password: form.value.newPassword
            })
            resetForm(formEl)
            emit('cancel')
          } catch (error: any) {
            Components.ElMessage.error('Failed: wrong password or coudn\'t update password!')
          }
        } else {
          console.log('error submit!')
          return false
        }
      })
    }
    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      form.value = {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }
      formEl.resetFields()
      emit('cancel')
    }
    return { form, formRef, rules, submitForm, resetForm }
  }
})
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
