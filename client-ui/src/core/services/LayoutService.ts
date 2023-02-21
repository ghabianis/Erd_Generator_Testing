/* static file*/
import objectPath from "object-path";
// import { Actions } from "@/store/enums/StoreEnums";
// import store from "@/store/";
import { config } from "@/core/helpers/config";
import { useBodyStore } from "@/store/useBodyModule";


const { addBodyClassName, addBodyAttribute } = useBodyStore();

class LayoutService {
  /**
   * @description initialize default layout
   */
  public static init(): void {
    LayoutService.initLayout();
    LayoutService.initHeader();
    LayoutService.initToolbar();
    LayoutService.initFooter();
    LayoutService.initAside();
  }

  /**
   * @description init layout
   */
  public static initLayout(): void {
    addBodyAttribute({
      qulifiedName: "id",
      value: "kt_body",
    });

    if (objectPath.get(config.value, "loader.display")) {
      addBodyClassName("page-loading-enabled");
      addBodyClassName("page-loading");
    }
  }

  /**
   * @description init header
   */
  public static initHeader(): void {
    if (objectPath.get(config.value, "header.fixed.desktop")) {
      addBodyClassName("header-fixed");
    }

    if (objectPath.get(config.value, "header.fixed.tabletAndMobile")) {
      addBodyClassName("header-tablet-and-mobile-fixed");
    }
  }

  /**
   * @description init toolbar
   */
  public static initToolbar(): void {
    if (!objectPath.get(config.value, "toolbar.display")) {
      return;
    }

    addBodyClassName("toolbar-enabled");

    if (objectPath.get(config.value, "toolbar.fixed")) {
      addBodyClassName("toolbar-fixed");
    }

    addBodyClassName("toolbar-tablet-and-mobile-fixed");
  }

  /**
   * @description init aside
   */
  public static initAside(): void {
    if (!objectPath.get(config.value, "aside.display")) {
      return;
    }

    // Enable Aside
    addBodyClassName("aside-enabled");

    // Minimized
    if (
      objectPath.get(config.value, "aside.minimized") &&
      objectPath.get(config.value, "aside.toggle")
    ) {
      addBodyAttribute({
        qulifiedName: "data-kt-aside-minimize",
        value: "on",
      });
    }

    if (objectPath.get(config.value, "aside.fixed")) {
      // Fixed Aside
      addBodyClassName("aside-fixed");
    }

    // Default minimized
    if (objectPath.get(config.value, "aside.minimized")) {
      addBodyAttribute({
        qulifiedName: "data-kt-aside-minimize",
        value: "on",
      });
    }
  }

  /**
   * @description init footer
   */
  public static initFooter(): void {
    // Fixed header
    if (objectPath.get(config.value, "footer.width") === "fixed") {
      addBodyClassName("footer-fixed");
    }
  }
}

export default LayoutService;
