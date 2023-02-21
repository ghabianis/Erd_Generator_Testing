import { Components } from "@tekab-dev-team/storybook-devfactory";
import router from "@/router/index";
import { supabase } from "@/core/services/SupabaseClientService";
import axios from "axios";
import { Provider } from "@supabase/supabase-js";

export class AuthService {
  async getCurrent() {
    let currentSession: any = await supabase.auth.session();
    let isLoggedIn: boolean = currentSession ? true : false;
    console.log("isLoggedIn service", isLoggedIn, currentSession);
    await supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_OUT" || !currentSession) {
        currentSession = null;
        isLoggedIn = false;
      } else {
        currentSession = session;
        isLoggedIn = true;
      }
    });
    return { session: currentSession, isLoggedIn: isLoggedIn };
  }
  // async getCurrentUser() {
  //   const localStorageData = localStorage.getItem(
  //     "supabase.auth.token"
  //   ) as string;
  //   const access_token =
  //     JSON.parse(localStorageData)?.currentSession?.access_token;
  //   const refresh_token =
  //     JSON.parse(localStorageData)?.currentSession?.refresh_token;
  //   try {
  //     const { user } = await supabase.auth.api.getUser(access_token);
  //     if (user)
  //       return {
  //         data: user,
  //         isLoggedIn: true,
  //         error: null,
  //         access_token,
  //         refresh_token,
  //       };
  //   } catch (error) {
  //     console.log(error, "error get current user");
  //     return {
  //       data: null,
  //       isLoggedIn: false,
  //       error,
  //       access_token: null,
  //       refresh_token: null,
  //     };
  //   }
  // }
  async signInWithEmail(email: string, password: string) {
    const credentials = { email: email, password: password };
    const result = await supabase.auth.signIn(credentials);
    const token = localStorage.getItem("supabase.auth.token");

    supabase.auth.setAuth(JSON.parse(token!).currentSession.access_token);

    if (result.user) {
      router.push({ name: "home" });
    } else if (result.error) {
      Components.ElMessage.error(result.error);
    }
    return result;
  }

  async signInWithProvider(provider: Provider) {
    const result = await supabase.auth.signIn({
      provider: provider
    })    
    return {result};
  }

  async signUp(email: string, password: string, firstName: string, lastName: string, role: string) {
    let result = await axios.post(
      import.meta.env.VITE_API_URL + "/nest/api/sign_up",
      {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: role,
      }
    );
    if (result.data.access_token) {
      try {
        const result = await this.signInWithEmail(email, password);
        return { data: result, error: null };
      } catch (error) {
        Components.ElMessage.error(error);
        return { data: null, error };
      }
    } else {
      console.log(
        "code error: " + result.data.code + ", msg: " + result.data.msg
      );
      Components.ElMessage.error(result.data.msg);
      return { data: null, error: result.data.msg };
    }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    router.push({ name: "sign-in" });
  }

  async resetByEmail(email: string) {
    try {
      let result = await supabase.auth.api.resetPasswordForEmail(email, {
        redirectTo: import.meta.env.VITE_SITE_URL + "/auth/password-reset",
      });
      console.log(result);
      if (result.error) {
        Components.ElMessage.error(result.error);
      } else {
        router.push({ name: "msg-reset-password" });
      }
    } catch (error: any) {
      console.log("error", error);
      Components.ElMessage.error(error.message);
    }
  }

  async reset(password: string) {
    try {
      const result = await supabase.auth.api.updateUser(this.getAccessToken(), {
        password: password,
      });

      if (result.data) {
        router.push({ name: "sign-in" });
      }
    } catch (error: any) {
      Components.ElMessage.error(error.message);
    }
  }
  tryParseJson = (jsonString: any) => {
    try {
      let parsed = JSON.parse(jsonString);
      return parsed;
    } catch (error) {
      return undefined;
    }
  };
  getParameterByName(name: string, url?: string) {
    // ignore if server-side
    if (typeof window === "undefined") return "";

    if (!url) url = window?.location?.href || "";
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&#]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  getAccessToken() {
    // ignore if server-side
    if (typeof window === "undefined") return "";

    const tokenData = window?.localStorage["supabase.auth.token"];
    if (!tokenData) {
      // try to get from url fragment
      const access_token = this.getParameterByName("access_token");
      if (access_token) return access_token;
      else return undefined;
    }
    const tokenObj = this.tryParseJson(tokenData);
    if (tokenObj === false) {
      return "";
    }
    return tokenObj.currentSession.access_token;
  }
}

export const authService = new AuthService();
