import { createApp } from "vue";

import "@/assets/sass/style.scss";
import "@/assets/sass/global.scss";

import App from "./App.vue";
import { createPinia } from "pinia";

import router from "./router";
import { Components, IconsVue } from "@tekab-dev-team/storybook-devfactory";

import i18n from "@/core/i18n/i18n";

//imports for app initialization
import { initInlineSvg } from "@/core/plugins/inline-svg";

import { MenuComponent, ToggleComponent } from "@/assets/ts/components";

import fr from "element-plus/es/locale/lang/fr";
import dayjs from 'dayjs' //import dayjs in your main.js


/**
 * Initialize custom components
 */
setTimeout(() => {
  ToggleComponent.bootstrap();
  MenuComponent.bootstrap();
}, 500);
const app = createApp(App);
for (const [key, component] of Object.entries(IconsVue)) {
  app.component(key, component);
}

app.use(router);
app.provide('$dayjs', dayjs);
app.use(createPinia());
app.use(i18n);

app.use(Components, {
  locale: fr,
});

initInlineSvg(app);
app.mount("#app");
