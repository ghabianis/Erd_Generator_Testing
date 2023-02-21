import { defineStore } from "pinia";
import service from "@/service";

interface IPagination {
  take: number;
  skip: number;
}

export const useProductStore = defineStore("product-store", {
  state: () => {
    return {
      productList: [] as Array<any>,
      isLoading: false,
      error: null as Object | any,
      pagination: {
        skip: 1,
        take: 3,
        total: 24,
      },
    };
  },

  getters: {},

  actions: {
    async fetchProducts(payload: IPagination) {
      this.isLoading = true;
      try {
        const { data } = await service.api.productControllerFindMany({
          skip: payload.skip,
          take: payload.take,
        });
        this.productList = data;
        this.pagination = {
          ...this.pagination,
          skip: payload.skip,
          take: payload.take,
        };
      } catch (err) {
        this.productList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteProduct(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.productControllerDelete(payload);
        this.productList = this.productList.filter(
          (product) => product.id !== data.id
        );
        this.isLoading = false;
      } catch (err) {
        this.productList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
