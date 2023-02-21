import { ref } from "vue";

export default function useDocMenuConfig() {
  const DocMenuConfig = ref([
    {
      pages: [
        {
          heading: "Home",
          route: "/",
          svgIcon: "svg/icons/art002.svg",
          fontIcon: "bi-app-indicator",
        },
      ],
    },
    {
      heading: "appconfigs",
      route: "/appconfigs",
      pages: [
        {
          heading: "All appconfigs",
          route: "/appconfigs",
          svgIcon: "/svg/icons/abs015.svg",
          fontIcon: "bi-calendar3-event",
        },
        {
          heading: "Create appconfig",
          route: "/appconfigs/create",
          svgIcon: "/svg/icons/lay009.svg",
          fontIcon: "bi-calendar3-event",
        },
        {
          heading: "Import data",
          route: "/appconfigs/import",
          svgIcon: "/svg/files/upload.svg",
          fontIcon: "bi-calendar3-event",
        },
      ],
    },
    {
      heading: "users",
      route: "/users",
      pages: [
        {
          heading: "All users",
          route: "/users",
          svgIcon: "/svg/icons/abs015.svg",
          fontIcon: "bi-calendar3-event",
        },
        {
          heading: "Create user",
          route: "/users/create",
          svgIcon: "/svg/icons/lay009.svg",
          fontIcon: "bi-calendar3-event",
        },
        {
          heading: "Import data",
          route: "/users/import",
          svgIcon: "/svg/files/upload.svg",
          fontIcon: "bi-calendar3-event",
        },
      ],
    },

    {
      sectionTitle: "authentication",
      svgIcon: "svg/icons//teh004.svg",
      fontIcon: "bi-sticky",
      sub: [
        {
          sectionTitle: "basicFlow",
          sub: [
            {
              heading: "signIn",
              route: "/auth/sign-in",
            },
            {
              heading: "signUp",
              route: "/auth/sign-up",
            },
            {
              heading: "passwordReset",
              route: "/auth/password-reset",
            },
            {
              heading: "emailResetPassword",
              route: "/auth/email-reset-password",
            },
            {
              heading: "msgResetPassword",
              route: "/auth/msg-reset-password",
            },
          ],
        },
        {
          heading: "error404",
          route: "/404",
        },
      ],
    },
    {
      pages: [],
    },
  ]);
  return DocMenuConfig;
}
