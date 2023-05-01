import { useAsyncData } from "nuxt/app";
import { z } from "zod";
import { productSchema } from "~/schemas/product";
import { useRuntimeConfig } from "nuxt/app";

const useProducts = async () => {
  const config = useRuntimeConfig();

  return await useAsyncData(
    "products",
    () =>
      $fetch("https://api.dekamarkt.nl/v1/assortmentcache/group/281/104", {
        query: { api_key: config.public.dekaApiKey },
      }),
    {
      transform: (res) => z.array(productSchema).parse(res),
    }
  );
};

export default useProducts;