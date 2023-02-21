import { defineStore } from "pinia";
import { authService } from "@/core/services/AuthService";
import service from "@/service";
import { Provider } from "@supabase/supabase-js";
import { supabase } from "@/core/services/SupabaseClientService";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      currentUser: null as any,
      accessToken: "" as string | undefined,
      refreshToken: "" as string | undefined,
      isLoggedIn: null as null | boolean,
    };
  },
  actions: {
    async login(email: string, password: string) {
      try {
        const { session } = await authService.signInWithEmail(email, password);
        this.isLoggedIn = true;
        this.currentUser = session?.user;
        this.accessToken = session?.access_token;
        this.refreshToken = session?.refresh_token!;
        service.setBaseApiParams({
          headers: {
            Authorization: "Bearer " + session?.access_token,
          },
        });
      } catch (error: any) {
        console.log(error?.message, "error login");
        throw new error("error login")
      }
    },
    async loginWithProvider(provider: Provider) {
      try {
        const {result} = await authService.signInWithProvider(provider);
        this.isLoggedIn = true;
        this.currentUser = result.session?.user;
        this.accessToken = result.session?.access_token;
        this.refreshToken = result.session?.refresh_token!;
        service.setBaseApiParams({
          headers: {
            Authorization: "Bearer " + result.session?.access_token,
          },
        });
        return {data : result.session , error : null};
         

      } catch (error: any) {
        console.log(error?.message, "error login");
        return {data : null , error : error};
      }
    },
    async signUp(email: string, password: string, firstName: string, lastName: string, role: string) {
      try {
        const result = await authService.signUp(email, password, firstName, lastName, role);
        if (result.data) {
          this.isLoggedIn = true;
          this.currentUser = {
            ...result?.data?.session?.user, user_metadata: {
              username: email,
              firstName: firstName,
              lastName: lastName
            }
          };
          this.accessToken = result?.data?.session?.access_token;
          this.refreshToken = result?.data?.session?.refresh_token!;
          service.setBaseApiParams({
            headers: {
              Authorization: "Bearer " + result?.data?.session?.access_token,
            },
          });
          await supabase.auth.update({
            data: {
              username: email,
              firstName: firstName,
              lastName: lastName
            }
          })
        }
      } catch (error) {
        console.log(error, "error signup");
      }
    },
    async resetByEmail(email: string) {
      await authService.resetByEmail(email);
    },
    async reset(password: string) {
      await authService.reset(password);
    },
    async logout() {
      await authService.signOut();
      this.currentUser = null;
      this.accessToken = "";
      this.refreshToken = "";
      this.isLoggedIn = false;
    },
    async getCurrent() {
      const result = await authService.getCurrent();
      this.isLoggedIn = result.isLoggedIn;
      if (result.session) {
        this.currentUser = result.session.user;
        this.accessToken = result.session.access_token;
        this.refreshToken = result.session.refresh_token!;
      } else {
        this.currentUser = null;
        this.accessToken = "";
        this.refreshToken = "";
      }
      console.log("isLoggedIn ", this.isLoggedIn);
      return result;
    },

    async changeEmail(payload: {email: string, password: string, userId: string}) {
      try {
        await service.api.authControllerChangeEmail({ email: payload.email, password: payload.password, userId: payload.userId })
        const newSession = await supabase.auth.api.refreshAccessToken(this.refreshToken as string)
        if (newSession.data) {
          localStorage.setItem("supabase.auth.token", JSON.stringify({"currentSession": newSession.data, "expiresAt": newSession.data.expires_at}));
          this.accessToken = newSession.data.access_token
          this.refreshToken = newSession.data.refresh_token
          this.currentUser = newSession.data.user
          service.setBaseApiParams({
          headers: {
            Authorization: "Bearer " + this.accessToken,
            },
          });
        return true
        } else {
          // any problem with getting newSession data will logout and ask to sign in again
          this.logout();
          return true
        }
        
      } catch (error: any) {
        console.log(error?.message, "error login");
        return false;
      }
    },
  },
});
