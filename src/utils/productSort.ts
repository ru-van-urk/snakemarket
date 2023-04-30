import useSort from "~/composables/useSort";
import { Product } from "~/schemas/product";

export const productSort = (a: Product, b: Product) => {
  const [sort] = useSort();

  if (!sort.value) return 0;

  if (sort.value?.type === "Prijs") {
    const priceA = a.ProductPrices[0].RegularPrice;
    const priceB = b.ProductPrices[0].RegularPrice;

    return sort.value?.sortOrder === "ASC" ? priceA - priceB : priceB - priceA;
  }
  //...
  throw new Error("Invalid sort type");
};
