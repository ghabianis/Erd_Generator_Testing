<template>
  <div
    class="col-12 col-md-8 mx-auto mt-4 border border-secondary p-5 px-8 card"
  >
    <h3 class="text-center text-primary mt-3 my-6">Import Data</h3>
    <el-form :model="form" :rules="rules" ref="ruleFormRef">
      <div class="d-flex justify-content-center m-2">
        <el-form-item prop="_dataSheet" class="w-100">
          <el-upload
            data-test="_dataSheet"
            class="col-8 upload"
            drag
            accept=".csv, .ods, .xlsx"
            :before-upload="handelUploadFile"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                drop file with a size less than 500kb
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </div>
      <div class="form_items">
        <el-form-item
          v-for="field in entityFields"
          :label="field"
          :prop="field"
          :key="field"
        >
          <el-select
            v-model="form[field]"
            :data-test="`userImportData_${field}`"
          >
            <el-option
              v-for="importedfield in importedFields"
              :key="importedfield"
              :data-test="importedfield"
              :value="importedfield"
              :label="importedfield"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="d-flex justify-content-end">
        <el-button
          data-test="userImportDataFormCancelButton"
          @click="resetForm(ruleFormRef)"
          >Clear</el-button
        >
        <el-button
          data-test="userImportDataFormSubmitButton"
          type="primary"
          @click="onSubmit(ruleFormRef)"
          >Load</el-button
        >
      </div>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/useUserModule";
import { useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import type { UploadProps } from "element-plus";
import XLSX from "xlsx";
import { isEqual } from "lodash";

const { error } = storeToRefs(useUserStore());
const { createManyUser } = useUserStore();
const router = useRouter();

const initialState = { firstName: "", lastName: "", username: "", roles: "" };
const entityFields = ref(Object.keys(initialState));
const form = ref({ _dataSheet: "", ...initialState });
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const importedFields: any = ref([]);
const userInsertData: any = ref([]);

const rules = reactive({
  _dataSheet: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
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
  roles: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
});

const handelUploadFile: UploadProps["onChange"] = (rawFile: any) => {
  if (rawFile) {
    form.value._dataSheet = rawFile.name;
    const reader = new FileReader();

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];
      /* Convert array of arrays */
      const headers = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        range: "A1:Z1",
        blankrows: false,
      });
      importedFields.value = headers[0];
      const jsonData = XLSX.utils.sheet_to_json(ws);
      userInsertData.value = jsonData;
    };
    reader.readAsBinaryString(rawFile);
  }
};

const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    const { _dataSheet, ...rest } = form.value;
    if (valid && !isEqual(initialState, rest)) {
      userInsertData.value = userInsertData.value.map((item: any) => {
        let res: any = {};
        for (let key in rest) {
          res[key] = item[rest[key]];
        }
        return res;
      });
      await createManyUser(userInsertData.value);

      if (!!error.value) {
        Components.ElMessage.error(error.value?.message);
        console.log(error, "error");
      } else {
        Components.ElMessage.success("Data loaded successfully");
        router.push({ name: "list-user" });
      }
    } else {
      console.log("error submit!");
      !_dataSheet.length > 0
        ? Components.ElMessage.error("Empty data")
        : isEqual(initialState, rest)
        ? Components.ElMessage.error(
            "Empty data please fill at least one database field"
          )
        : Components.ElMessage.error("error submit!");
      return false;
    }
  });
};
const resetForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  Object.assign(form, { _dataSheet: "", ...initialState });
  formEl.resetFields();
};
</script>
<style lang="scss" scoped>
:deep(.el-upload) {
  width: 100%;
}
:deep(.el-upload-dragger) {
  width: 100%;
  background: var(--el-color-primary-transparent);
}
:deep(.el-form-item__content) {
  width: 100%;
  justify-content: center;
}
:deep(.el-form-item) {
  display: block;
}

.form_items {
  display: grid;
  gap: 15px;
  justify-content: left;
  justify-items: center;
  grid-template-columns: 32% 32% 32%;
}
@media screen and (max-width: 768px) {
  .form_items {
    grid-template-columns: 48% 48%;
  }
  .upload {
    flex: 0 0 auto;
    width: 100%;
  }
}
@media screen and (max-width: 350px) {
  .form_items {
    display: block;
  }
}
</style>
