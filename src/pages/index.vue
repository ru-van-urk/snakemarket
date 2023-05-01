<script setup lang="ts">
  import { productSchema } from "~/schemas/product";
  import FilterBar from "~/components/filter-bar.vue";
  import { productFilter } from "~/utils/getProductFilters";
  import { z } from "zod";
  import { useAsyncData, useRuntimeConfig } from "nuxt/app";
  import ProductCard from "~/components/product-card.vue";
  import useSort from "~/composables/useSort";

  const config = useRuntimeConfig();

  const {
    data: products,
    pending,
    error,
  } = await useAsyncData(
    "products",
    () =>
      $fetch("https://api.dekamarkt.nl/v1/assortmentcache/group/281/104", {
        query: { api_key: config.public.dekaApiKey },
      }),
    {
      transform: (res) => z.array(productSchema).parse(res),
    }
  );

  const [productSort] = useSort();
</script>

<template>
  <div>
    <span v-if="pending">Loading...</span>
    <span v-else-if="error">Error: {{ error.message }}</span>

    <main v-else-if="products">
      <FilterBar />

      <section
        class="flex flex-wrap container mx-auto justify-center md:justify-start"
      >
        <ProductCard
          v-for="product in products.filter(productFilter).sort(productSort)"
          :key="product.ProductID"
          :product="product"
        />
      </section>
    </main>
  </div>
</template>
