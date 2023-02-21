import {
  AppConfigUpdateInput,
  AppConfigCreateInput,
  AppConfig,
} from "./../../index";
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
const initialState: AppConfig | AppConfigCreateInput | AppConfigUpdateInput = {
  value: "",
  key: "",
};
export const useAppConfigStore = defineStore("appconfig-store", {
  state: () => {
    return {
      appconfigList: [] as Array<AppConfig>,
      error: null as Object | any,
      appconfig: _.cloneDeep(initialState),
      appconfigExcelFile: "" as string,
      appconfigPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 5,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchAppConfigs(payload: IPagination) {
      try {
        const { data } = await service.api.appConfigControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.appconfigList = data.paginatedResult;

        this.appconfigList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.appconfigPagination = {
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
        this.appconfigList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelAppConfigs() {
      try {
        const {
          data,
        } = await service.api.appConfigControllerFindDataForExcel();
        this.appconfigExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
    async softDeleteAppConfig(payload: string) {
      isLoading.value = true;
      try {
        const { data } = await service.api.appConfigControllerUpdate(payload, {
          deletedAt: new Date(),
        });
        this.error = null;
        this.fetchAppConfigs({
          take: this.appconfigPagination.take,
          skip: this.appconfigPagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        isLoading.value = false;
      } finally {
        isLoading.value = false;
      }
    },
    async deleteAppConfig(payload: string) {
      isLoading.value = true;
      try {
        const { data } = await service.api.appConfigControllerDelete(payload);
        this.appconfigList = this.appconfigList.filter(
          (appconfig) => appconfig.id !== data.id
        );
        this.appconfigPagination.total--;
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
    async editAppConfig(payload: { id: string; data?: AppConfigUpdateInput }) {
      isLoading.value = true;
      try {
        const { data } = await service.api.appConfigControllerUpdate(
          payload.id,
          payload.data ?? this.appconfig
        );
        this.appconfigList = this.appconfigList.map((item) =>
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
      async editManyAppConfig(payload: { data: AppConfigUpdateInput; where: any }) {
        isLoading.value  = true;
        try {
          const { data } = await service.api.appConfigControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.appconfigList = this.appconfigList.map((item) =>
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

    async getAppConfigById(payload: string) {
      isLoading.value = true;
      try {
        const { data } = await service.api.appConfigControllerFindOne(payload);
        this.appconfig = data;
        this.error = null;
      } catch (err: any) {
        this.resetAppConfig();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
    async createAppConfig(payload?: { data: AppConfigCreateInput }) {
      isLoading.value = true;
      try {
        const { data } = await service.api.appConfigControllerCreate(
          payload?.data ?? (this.appconfig as AppConfigCreateInput)
        );
        this.appconfigList = [...this.appconfigList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
    async createManyAppConfig(payload: any) {
      isLoading.value = true;
      try {
        const { data } = await service.api.appConfigControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },

    resetAppConfig() {
      this.appconfig = _.cloneDeep(initialState);
    },
  },
});
