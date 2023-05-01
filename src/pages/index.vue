<script setup lang="ts">
  import { productSchema } from "~/schemas/product";
  import FilterBar from "~/components/filter-bar.vue";
  import { z } from "zod";
  import { useAsyncData, useRuntimeConfig } from "nuxt/app";
  import ProductCard from "~/components/product-card.vue";
  import useSort from "~/composables/useSort";
  import useFilters from "~/composables/useFilters";

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

  const { sortFn } = useSort();
  const { filterFn } = useFilters();
</script>

<template>
  <div>
    <span v-if="pending">Loading...</span>
    <span v-else-if="error">Error: {{ error.message }}</span>

    <main v-else-if="products">
      <FilterBar />

      <section class="flex flex-wrap justify-start container mx-auto">
        <ProductCard
          v-for="product in products.filter(filterFn).sort(sortFn)"
          :key="product.ProductID"
          :product="product"
        />
      </section>
    </main>
  </div>
</template>
