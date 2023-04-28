import { Product } from "~/composables/useProducts";

export const sortTypes = ["Prijs"] as const;

export type SortType = (typeof sortTypes)[number];
export type SortOrder = "ASC" | "DES";
export type Sort = { type: SortType; sortOrder: SortOrder };

export const getSortedProducts = (products: Product[], sort?: Sort) => {
  const compareFn = (a: Product, b: Product) => {
    if (sort?.type === "Prijs") {
      const priceA = a.ProductPrices[0].RegularPrice;
      const priceB = b.ProductPrices[0].RegularPrice;

      return sort.sortOrder === "ASC" ? priceA - priceB : priceB - priceA;
    }
    //...
    throw new Error("Invalid sort type");
  };

  return [...products].sort(compareFn);
};
