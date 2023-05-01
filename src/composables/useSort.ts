import { useState } from "nuxt/app";
import { Product } from "~/schemas/product";

export const sortTypes = ["Prijs"] as const;

export type SortType = (typeof sortTypes)[number];
export type SortOrder = "ASC" | "DES";
export type Sort = { type: SortType; sortOrder: SortOrder };

const useSort = () => {
  const sort = useState<Sort | undefined>("sort");

  const getSort = (a: Product, b: Product) => {
    if (!sort.value) return 0;

    if (sort.value?.type === "Prijs") {
      const priceA = a.ProductPrices[0].RegularPrice;
      const priceB = b.ProductPrices[0].RegularPrice;

      return sort.value?.sortOrder === "ASC"
        ? priceA - priceB
        : priceB - priceA;
    }
    //...
    throw new Error("Invalid sort type");
  };

  const setSort = (type: SortType) => {
    let newSort: Sort | undefined = undefined;

    if (!sort.value || sort.value.type !== type) {
      newSort = { type, sortOrder: "ASC" };
    }
    if (sort.value?.sortOrder === "ASC") {
      newSort = { type, sortOrder: "DES" };
    }
    if (sort.value?.sortOrder === "DES") {
      newSort = undefined;
    }

    sort.value = newSort;
  };

  return [getSort, setSort] as const;
};

export default useSort;
