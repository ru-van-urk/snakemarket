import { useState } from "nuxt/app";
import { Product } from "~/schemas/product";

export const sortTypes = ["Prijs"] as const;

export type SortType = (typeof sortTypes)[number];
export type SortOrder = "ASC" | "DES";
export type Sort = { type: SortType; sortOrder: SortOrder };

const useSort = () => {
  const activeSort = useState<Sort | undefined>("sort");

  const sortFn = (a: Product, b: Product) => {
    if (!activeSort.value) return 0;

    if (activeSort.value?.type === "Prijs") {
      const priceA = a.ProductPrices[0].RegularPrice;
      const priceB = b.ProductPrices[0].RegularPrice;

      return activeSort.value?.sortOrder === "ASC"
        ? priceA - priceB
        : priceB - priceA;
    }
    //...
    throw new Error("Invalid sort type");
  };

  const setSort = (type: SortType) => {
    let newSort: Sort | undefined = undefined;

    if (!activeSort.value || activeSort.value.type !== type) {
      newSort = { type, sortOrder: "ASC" };
    }
    if (activeSort.value?.sortOrder === "ASC") {
      newSort = { type, sortOrder: "DES" };
    }
    if (activeSort.value?.sortOrder === "DES") {
      newSort = undefined;
    }

    activeSort.value = newSort;
  };

  return { activeSort, setSort, sortFn } as const;
};

export default useSort;
