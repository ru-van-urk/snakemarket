import { useState } from "nuxt/app";
import { Product } from "~/schemas/product";

export const sortTypes = ["Prijs"] as const;

export type SortType = (typeof sortTypes)[number];
export type SortOrder = "ASC" | "DES";
export type Sort = { type: SortType; sortOrder: SortOrder };

export const getProductOrder = (a: Product, b: Product) => {
  const sort = useState<Sort>("sort").value;

  if (!sort) return 0;

  if (sort?.type === "Prijs") {
    const priceA = a.ProductPrices[0].RegularPrice;
    const priceB = b.ProductPrices[0].RegularPrice;

    return sort.sortOrder === "ASC" ? priceA - priceB : priceB - priceA;
  }
  //...
  throw new Error("Invalid sort type");
};
