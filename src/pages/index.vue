<script setup lang="ts">
  import { productSchema } from "~/schemas/product";
  import FilterBar from "~/components/filter-bar.vue";
  import { z } from "zod";
  import { useAsyncData, useRuntimeConfig } from "nuxt/app";
  import ProductCard from "~/components/product-card.vue";
  import useSort from "~/composables/useSort";
  import useFilters from "~/composables/useFilters";
  import useProducts from "~/composables/useProducts";

  const { data: products, pending, error } = await useProducts();

  const { sortFn } = useSort();
  const { filterFn } = useFilters();
</script>

<template>
  <div>
    <span
      v-if="pending"
      class="w-full h-screen flex items-center justify-center"
    >
      <Spinner />
    </span>

    <span v-else-if="error">Error: {{ error.message }}</span>

    <main v-else-if="products">
      <FilterBar />

      <section class="flex flex-wrap justify-center gap-2 md:gap-8">
        <ProductCard
          v-for="product in products.filter(filterFn).sort(sortFn)"
          :key="product.ProductID"
          :product="product"
        />
      </section>
    </main>
  </div>
</template>
