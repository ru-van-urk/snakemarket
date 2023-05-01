<script setup lang="ts">
  import FilterBar from "~/components/filter-bar.vue";
  import ProductCard from "~/components/product-card.vue";
  import useSort from "~/composables/useSort";
  import useFilters from "~/composables/useFilters";
  import useProducts from "~/composables/useProducts";
  import { useHead } from "nuxt/app";

  const { data: products, pending, error } = await useProducts();

  const { sortFn } = useSort();
  const { filterFn } = useFilters();

  useHead({
    title: `Snake 🛒 Markt - Overzicht`,
  });
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
