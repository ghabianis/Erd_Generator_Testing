import { UserUpdateInput, UserCreateInput, User } from "./../../index";
import { defineStore } from "pinia";
import service from "@/service";
import { storeToRefs } from "pinia";
import { useBodyStore } from "@/store/useBodyModule";
import _ from "lodash";

interface IPagination {
  take?: number;
  skip?: number;
}
const { isLoading } = storeToRefs(useBodyStore());
const initialState: User | UserCreateInput | UserUpdateInput = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  isValid: false,
  roles: "",
};
export const useUserStore = defineStore("user-store", {
  state: () => {
    return {
      userList: [] as Array<User>,
      error: null as Object | any,
      user: _.cloneDeep(initialState),
      userExcelFile: "" as string,
      userPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 5,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchUsers(payload: IPagination) {
      try {
        const { data } = await service.api.userControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.userList = data.paginatedResult;

        this.userList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.userPagination = {
          total: data.totalCount,
          skip: payload?.skip ?? 0,
          take: payload?.take ?? data.totalCount,
        };
        localStorage.setItem(
          "take",
          payload?.take?.toString() ?? data.totalCount.toString()
        );
        this.error = null;
      } catch (err: any) {
        this.userList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelUsers() {
      try {
        const { data } = await service.api.userControllerFindDataForExcel();
        this.userExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
    async softDeleteUser(payload: string) {
      isLoading.value = true;
      try {
        const { data } = await service.api.userControllerUpdate(payload, {
          deletedAt: new Date(),
        });
        this.error = null;
        this.fetchUsers({
          take: this.userPagination.take,
          skip: this.userPagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        isLoading.value = false;
      } finally {
        isLoading.value = false;
      }
    },
    async deleteUser(payload: string) {
      isLoading.value = true;
      try {
        const { data } = await service.api.userControllerDelete(payload);
        this.userList = this.userList.filter((user) => user.id !== data.id);
        this.userPagination.total--;
        isLoading.value = false;
        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        isLoading.value = false;
      } finally {
        isLoading.value = false;
      }
    },
    async editUser(payload: { id: string; data?: UserUpdateInput }) {
      isLoading.value = true;
      try {
        const { data } = await service.api.userControllerUpdate(
          payload.id,
          payload.data ?? this.user
        );
        this.userList = this.userList.map((item) =>
          item.id === payload.id ? { ...item, ...data } : item
        );
        this.error = null;
      } catch (err: any) {
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    } /*
      async editManyUser(payload: { data: UserUpdateInput; where: any }) {
        isLoading.value  = true;
        try {
          const { data } = await service.api.userControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.userList = this.userList.map((item) =>
            item.id === payload.id ? { ...item, ...payload.data } : item
          );
          this.error = null;
        } catch (err:any) {
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          isLoading.value = false;
        }
      },*/,

    async getUserById(payload: string) {
      isLoading.value = true;
      try {
        const { data } = await service.api.userControllerFindOne(payload);
        this.user = data;
        this.error = null;
      } catch (err: any) {
        this.resetUser();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
    async createUser(payload?: { data: UserCreateInput }) {
      isLoading.value = true;
      try {
        const { data } = await service.api.authControllerInviteUser(
          payload?.data ?? (this.user as UserCreateInput)
        );
        this.userList = [...this.userList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
    async createManyUser(payload: any) {
      isLoading.value = true;
      try {
        const { data } = await service.api.userControllerCreateMany(payload);
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },

    resetUser() {
      this.user = _.cloneDeep(initialState);
    },
  },
});
