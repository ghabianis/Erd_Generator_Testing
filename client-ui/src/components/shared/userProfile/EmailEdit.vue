<template>
  <div
    id="kt_signin_email_edit"
    :class="{ 'd-none': !emailFormDisplay }"
    class="flex-row-fluid"
  >
    <!--begin::Form-->
    <el-form
      id="kt_signin_change_email"
      ref="formRef"
      class="form"
      novalidate="novalidate"
      :rules="rules"
      :model="form"
    >
      <div class="row mb-6">
        <div class="col-lg-6 mb-4 mb-lg-0">
          <div class="fv-row mb-0">
            <el-form-item prop="email">
              <label
                for="emailaddress"
                class="form-label fs-6 fw-bold mb-3"
              >Saissez une nouvelle adresse e-mail</label>
              <el-input
                id="emailaddress"
                v-model="form.email"
                type="email"
                placeholder="Email Address"
                name="emailaddress"
                size="large"
              />
            </el-form-item>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="fv-row mb-0">
            <el-form-item prop="password">
              <label
                for="confirmemailpassword"
                class="form-label fs-6 fw-bold mb-3"
              >Confirmez le mot de passe</label>
              <el-input
                id="confirmemailpassword"
                v-model="form.password"
                type="password"
                name="confirmemailpassword"
                size="large"
                show-password
              />
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="d-flex">
        <el-button
          id="kt_email_submit"
          type="primary"
          class="submit-btn"
          @click="updateEmail(formRef)"
        >
          <span class="indicator-label"> Mise à jour Email </span>
        </el-button>
        <el-button
          id="kt_email_cancel"
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
import { defineComponent, ref, onMounted } from 'vue'
import { Components } from '@tekab-dev-team/storybook-devfactory'
import { useAuthStore } from '@/store/useAuth'
import { storeToRefs } from 'pinia'
import { t } from '@/core/i18n/translate'
import type { ElForm } from 'element-plus'
export default defineComponent({
  components: {},
  props: {
    emailFormDisplay: {
      required: true
    }
  },
  emits: ['cancel'],
  setup (props, { emit }) {
    const { currentUser } = storeToRefs(useAuthStore())
    const { changeEmail } = useAuthStore()
    const form = ref({ email: '', password: '' })
    const formRef = ref<InstanceType<typeof ElForm>>()
    const rules = ref({
      email: [
        {
          required: true,
          message: `${t('entityForm.validation.required')}`,
          trigger: 'blur'
        },
        {
          type: 'email',
          message: 'Please input correct email address',
          trigger: ['blur', 'change']
        }
      ],
      password: [
        {
          required: true,
          message: `${t('entityForm.validation.required')}`,
          trigger: 'blur'
        }
      ]
    })
    onMounted(() => {
      form.value.email =
        currentUser?.value.username ??
        currentUser?.value.user_metadata?.username
    })
    const updateEmail = async (
      formEl: InstanceType<typeof ElForm> | undefined
    ) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          const payload = {
            userId: currentUser.value.id,
            email: form.value.email,
            password: form.value.password
          }
          try {
            const isEmailUpdated = await changeEmail(payload)
            if (isEmailUpdated) {
              emit('cancel')
            } else {
              Components.ElMessage.error(
                'Failed: Email already in use or wrong password'
              )
            }
          } catch (error: any) {
            console.log('ERROR:', error)
            Components.ElMessage.error(
              'Failed: Coudn\'t update email!'
            )
          }
        } else {
          console.log('error submit!')
          return false
        }
      })
    }

    const resetForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
      if (!formEl) return
      form.value = {
        email:
          currentUser?.value.username ??
          currentUser?.value.user_metadata?.username,
        password: ''
      }
      formEl.resetFields()
      emit('cancel')
    }
    return {
      updateEmail,
      form,
      formRef,
      rules,
      resetForm
    }
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
