<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { ElConfigProvider } from "element-plus";
import fr from "element-plus/lib/locale/lang/fr";
import en from "element-plus/lib/locale/lang/en";
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/useAuth";
import service from "@/service";
import { supabase } from "./core/services/SupabaseClientService";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const { locale } = useI18n({});
const { accessToken } = storeToRefs(useAuthStore());
const currentRoute = computed(() => route.name);
const currentLang = computed(() => {
  if (locale.value === "en") {
    return en;
  } else {
    return fr;
  }
});
let { getCurrent } = useAuthStore();

onMounted(async () => {
  await getCurrent();
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN")
      router.push({ name: currentRoute?.value?.toString() });
  });
  await service.setBaseApiParams({
    headers: {
      Authorization: "Bearer " + accessToken.value,
    },
  });
});
</script>
<template>
  <ElConfigProvider :locale="currentLang">
    <router-view />
  </ElConfigProvider>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap");
@import "@tekab-dev-team/storybook-devfactory/theme/style.css" ;
#app {
  font-family: "Poppins", Helvetica, Arial, sans-serif;
}
</style>
