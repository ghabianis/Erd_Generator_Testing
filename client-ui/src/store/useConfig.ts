/* static file*/
import objectPath from "object-path";
import { defineStore } from "pinia";
import layoutConfig from "@/core/config/DefaultLayoutConfig";

import merge from "deepmerge";

import LayoutConfigTypes from "@/core/config/LayoutConfigTypes";

interface StoreInfo {
  config: LayoutConfigTypes;
  initial: LayoutConfigTypes;
}
export interface ModalOption {
  closeable?: boolean;
  isClose?: boolean;
}
interface Drawer {
  type: string;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  payload: any;
  options?: ModalOption;
}
interface DrawerInfo {
  drawerState: Modal;
}

interface Modal {
  type: string;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  payload: any;
  options?: ModalOption;
}

interface ModalInfo {
  modalState: Modal;
}

interface Breadcrumb {
  title: string;
  pageBreadcrumbPath: Array<string>;
}

interface StoreInfo {
  breadcrumbs: Breadcrumb;
}

export const useConfigStore = defineStore("config-module", {
  state: () => ({
    config: layoutConfig,
    initial: layoutConfig,
    modalState: { type: "", payload: {}, options: {} },
    drawerState: { type: "", payload: {}, options: {} },
    breadcrumbs: {} as Breadcrumb,
  }),
  getters: {
    /**
     * Get config from layout config
     * @returns {function(path, defaultValue): *}
     */
    layoutConfig: (state) => (path: any, defaultValue: any) =>
      objectPath.get(state.config, path, defaultValue),
    getModalState: (state): Modal => {
      return state.modalState;
    },

    getDrawerState: (state): Drawer => {
      return state.drawerState;
    },

    /**
     * Get breadcrumb object for current page
     * @returns object
     */
    getBreadcrumbs: (state): Breadcrumb => {
      return state.breadcrumbs;
    },

    /**
     * Get breadcrumb array for current page
     * @returns object
     */
    pageBreadcrumbPath: (state): Array<string> => {
      return state.breadcrumbs.pageBreadcrumbPath;
    },

    /**
     * Get current page title
     * @returns string
     */
    pageTitle: (state): string => {
      return state.breadcrumbs.title;
    },
  },
  actions: {
    setLayoutConfig(payload: any): void {
      this.config = payload;
    },
    resetLayoutConfig() {
      this.config = Object.assign({}, this.initial);
    },
    overrideLayoutConfig(): void {
      this.config = this.initial = Object.assign(
        {},
        this.initial,
        JSON.parse(window.localStorage.getItem("config") || "{}")
      );
    },
    overridePageLayoutConfig(payload: any): void {
      this.config = merge(this.config, payload);
    },

    fetchModal(payload: any) {
      this.modalState = payload;
    },

    fetchDrawer(payload: any) {
      this.drawerState = payload;
    },

    setBreadcrumbs(payload: any) {
      this.breadcrumbs = payload;
    },
  },
});
