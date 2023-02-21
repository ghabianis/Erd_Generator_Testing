/* static file*/
import { defineStore } from "pinia";

export interface StoreInfo {
  classes: {
    header?: Array<string>;
    headerContainer?: Array<string>;
    headerMobile?: Array<string>;
    headerMenu?: Array<string>;
    toolbar?: Array<string>;
    toolbarContainer?: Array<string>;
    aside?: Array<string>;
    asideMenu?: Array<string>;
    asideToggle?: Array<string>;
    content?: Array<string>;
    contentContainer?: Array<string>;
    footerContainer?: Array<string>;
    sidebar?: Array<string>;
    pageTitle?: Array<string>;
  };
}

export const useBodyStore = defineStore("body-module", {
  state: () => ({
    classes: {},
    isLoading: false,
  }),
  getters: {},
  actions: {
    addBodyAttribute(payload: any) {
      const { qulifiedName, value } = payload;
      document.body.setAttribute(qulifiedName, value);
    },

    removeBodyClassName(className: string) {
      document.body.classList.remove(className);
    },

    addBodyClassName(className: string) {
      return document.body.classList.add(className);
    },
  },
});
