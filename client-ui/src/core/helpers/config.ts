/* static file*/
import { computed } from "@vue/reactivity";
import { useConfigStore } from "@/store/useConfig";
import { ModalOption } from "@/store/useConfig";

const configStore = useConfigStore();

/**
 * Returns layout config
 * @returns {object}
 */
export const config = computed(() => configStore.layoutConfig(null, null));

/**
 * Check if footer container is fluid
 * @returns {boolean}
 */
export const footerWidthFluid = computed(
  () => configStore.layoutConfig("footer.width", "footer.width") === "fluid"
);

/**
 * Check if header container is fluid
 * @returns {boolean}
 */
export const headerWidthFluid = computed(
  () => configStore.layoutConfig("header.width", "header.width") === "fluid"
);

/**
 * Returns header left part type
 * @returns {string}
 */
export const headerLeft = computed(() =>
  configStore.layoutConfig("header.left", "header.left")
);

/**
 * Set the aside display
 * @returns {boolean}
 */

export const asideDisplay = computed(
  () => configStore.layoutConfig("aside.display", "aside.display") === true
);

/**
 * Check if toolbar width is fluid
 * @returns {boolean}
 */
export const toolbarWidthFluid = computed(
  () => configStore.layoutConfig("toolbar.width", "toolbar.width") === "fluid"
);

/**
 * Set the toolbar display
 * @returns {boolean}
 */

export const toolbarDisplay = computed(
  () =>
    configStore.layoutConfig("toolbar.display", "toolbar.display") === "fluid"
);

/**
 * Check if the page loader is enabled
 * @returns {boolean}
 */
export const loaderEnabled = computed(() =>
  configStore.layoutConfig("loader.display", "loader.display")
);

/**
 * Check if container width is fluid
 * @returns {boolean}
 */
export const contentWidthFluid = computed(
  () => configStore.layoutConfig("content.width", "content.width") === "fluid"
);

/**
 * Page loader logo image
 * @returns {string}
 */
export const loaderLogo = computed(
  () =>
    './' +
    configStore.layoutConfig("loader.logo", "loader.logo")
);

/**
 * Check if the aside menu is enabled
 * @returns {boolean}
 */
export const asideEnabled = computed(() => {
  return !!configStore.layoutConfig("aside.display", "");
});

/**
 * Set the aside theme
 * @returns {string}
 */
export const asideTheme = computed(() =>
  configStore.layoutConfig("aside.theme", "aside.theme")
);

/**
 * Set the subheader display
 * @returns {boolean}
 */
export const subheaderDisplay = computed(() =>
  configStore.layoutConfig("toolbar.display", "toolbar.display")
);

/**
 * Set the aside menu icon type
 * @returns {string}
 */
export const asideMenuIcons = computed(() => {
  return configStore.layoutConfig("aside.menuIcon", "aside.menuIcon");
});

/**
 * Light theme logo image
 * @returns {string}
 */
export const themeLightLogo = computed(() => {
  return configStore.layoutConfig("main.logo.light", "main.logo.light");
});

/**
 * Set the header menu icon type
 * @returns {string}
 */
export const headerMenuIcons = computed(() => {
  return configStore.layoutConfig("header.menuIcon", "header.menuIcon");
});
// TODO modal
/**
 * Sets current Modal
 * @param {string} type Current modal type
 */
export const setModal = (
  type: string,
  payload = {},
  options: ModalOption = { closeable: true, isClose: false }
): void => {
  configStore.fetchModal({
    type: type,
    payload,
    options,
  });
};
/**
 * Sets current Modal
 * @param {string} type Current modal type
 */
export const setDrawer = (
  type: string,
  payload = {},
  options: ModalOption = { closeable: true, isClose: false }
): void => {
  configStore.fetchDrawer({
    type: type,
    payload,
    options,
  });
};

// TODO :breadcrumbs
/**
 * Sets current page breadcrumbs
 * @param {string} pageTitle Current page title
 * @param {Array<string>} breadcrumbs Current page breadcrumbs
 */
export const setCurrentPageBreadcrumbs = (
  pageTitle: string,
  breadcrumbs: Array<string>
): void => {
  configStore.setBreadcrumbs({
    title: pageTitle,
    pageBreadcrumbPath: breadcrumbs,
  });
};

/**
 * Sets current page breadcrumbs
 * @param {string} title Current page title name
 */
export const setCurrentPageTitle = (title: string): void => {
  configStore.setBreadcrumbs({
    title: title,
  });
};
/**
 * Reset current page breadcrumbs
 */
export const resetPageBreadcrumbs = (): void => {
  configStore.setBreadcrumbs({});
};
