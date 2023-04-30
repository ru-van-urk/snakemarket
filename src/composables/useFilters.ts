import { useNuxtData, useState } from "nuxt/app";
import { Product } from "~/schemas/product";
import { getProductFilterOptions } from "~/utils/getProductFilters";

const useFilters = () => {
  const products = useNuxtData<Product[]>("products").data.value;

  const filters = useState("filters", () =>
    getProductFilterOptions(products ?? [])
  );

  return filters;
};

export default useFilters;
